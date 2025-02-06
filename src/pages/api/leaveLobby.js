import { auth } from "@/app/auth";
import { verifyToken } from "@/_utils/jwt";
import prisma from "@/_lib/database/prisma";

export default async function handler(req, res) {
    const session = await auth(req, res);
    if (!session?.user) {
        prisma.$disconnect();
        res.status(401).json({ error: "Not authenticated", status: 401 });
        return;
    }
    if (session.user.baned) {
        prisma.$disconnect();
        res.status(403).json({ error: "You are banned", status: 403 });
        return;
    }
    if (req.method !== "POST") {
        prisma.$disconnect();
        res.status(405).json({ error: "Method not allowed", status: 405 });
        return;
    }

    try {
        let lobby;
        try {
            lobby = await prisma.lobby.findUnique({
                where: {
                    id: session.user.lobbyId,
                },
            });
            console.log(lobby.players);
            lobby.players = lobby.players.map((player) => JSON.parse(player));
            console.log(lobby.players);
            lobby.players = lobby.players.filter(
                (data) => data.id !== session.user.id
            );
            console.log(lobby.players);
        } catch (error) {
            lobby = null;
        }
        if (lobby) {
            await prisma.user.update({
                where: {
                    id: session.user.id,
                },
                data: {
                    lobbyId: null,
                },
            });
            await prisma.lobby.update({
                where: {
                    id: session.user.lobbyId,
                },
                data: {
                    players: lobby.players.map((player) =>
                        JSON.stringify(player)
                    ),
                },
            });
            res.status(200).json({ lobby: lobby, status: 200 });
        } else {
            res.status(404).json({
                error: `Lobby not found with id ${session.user.lobbyId}`,
                status: 404,
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message,
        });
    }
    prisma.$disconnect();
}

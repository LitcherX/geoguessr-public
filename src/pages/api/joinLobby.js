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
        var { joinCode } = req.body;
        let lobby;
        try {
            lobby = await prisma.lobby.findUnique({
                where: {
                    joinCode: parseInt(joinCode),
                    started: false,
                    NOT: {
                        ownerId: session.user.id,
                    },
                },
            });
            lobby.players = lobby.players.map((player) => JSON.parse(player));
            if (lobby.players.length + 1 > lobby.count) {
                prisma.$disconnect();
                res.status(400).json({
                    error: `Too many players in the lobby`,
                    status: 400,
                });
                return;
            }
            lobby.players.push({
                id: session.user.id,
                name: session.user.name,
                image: session.user.image,
            });
            lobby.players = lobby.players.filter(
                (player, index, self) =>
                    index ===
                    self.findIndex(
                        (t) =>
                            t.id === player.id &&
                            t.name === player.name &&
                            t.image === player.image
                    )
            );
            await prisma.lobby.update({
                where: {
                    joinCode: parseInt(joinCode),
                },
                data: {
                    players: lobby.players.map((player) =>
                        JSON.stringify(player)
                    ),
                },
            });
            await prisma.user.update({
                where: {
                    id: session.user.id,
                },
                data: {
                    lobbyId: lobby.id,
                },
            });
        } catch (error) {
            lobby = null;
            console.log(error);
        }
        if (lobby) {
            res.status(200).json({ lobby: lobby, status: 200 });
        } else {
            res.status(404).json({
                error: `Lobby not found with code ${joinCode}`,
                status: 404,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            error: error.message,
        });
    }
    prisma.$disconnect();
}

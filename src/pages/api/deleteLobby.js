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
        await prisma.Lobby.delete({
            where: {
                id: session.user.lobbyId,
                owner: {
                    id: session.user.id,
                },
            },
        });
        await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                lobbyId: null,
            },
        });
        res.status(200).json({ message: "Deleted lobby", status: 200 });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            status: 500,
        });
    }
    prisma.$disconnect();
}

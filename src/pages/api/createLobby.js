import { auth } from "@/app/auth";
import { verifyToken } from "@/_utils/jwt";
import random from "random";
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
        var code = generateCode();
        var unique = false;
        while (!unique) {
            var count = await prisma.Lobby.findUnique({
                where: {
                    joinCode: code,
                },
            });
            if (!count) {
                unique = true;
            } else {
                code = generateCode();
            }
        }
        var lobby = await prisma.Lobby.create({
            data: {
                joinCode: code,
                owner: {
                    connect: { id: session.user.id },
                },
                players: [
                    JSON.stringify({
                        id: session.user.id,
                        name: session.user.name,
                        image: session.user.image,
                    }),
                ],
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
        res.status(200).json({ lobby: lobby, status: 200 });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            status: 500,
        });
    }
    prisma.$disconnect();
}

function generateCode() {
    return random.int(1000, 9999);
}

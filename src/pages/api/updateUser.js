import { auth } from "@/app/auth";
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
        const { username, rem, displayname, settings } = req.body;
        const { emailNotification = null, discordNotification = null } =
            settings || {};
        if (rem) {
            await prisma.user.delete({
                where: {
                    id: session.user.id,
                },
            });
            return res.status(200).json({ message: "Deleted", status: 200 });
        }
        console.log(settings);
        await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                ...(username ? { uniqueName: username } : {}),
                ...(displayname ? { name: displayname } : {}),
                ...(settings
                    ? {
                          settings: {
                              update: {
                                  emailNotification: emailNotification,
                                  discordNotification: discordNotification,
                              },
                          },
                      }
                    : {}),
            },
        });
        const _temp = await prisma.user.findUnique({
            where: {
                id: session.user.id,
            },
            include: {
                email: false,
                Leaderboard: true,
                settings: true,
            },
        });
        return res
            .status(200)
            .json({ message: "Updated", status: 200, user: _temp });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            status: 500,
        });
    }
    prisma.$disconnect();
}

function generateCode() {
    return random.int(1000, 9999);
}

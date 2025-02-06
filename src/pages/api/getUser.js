import { auth } from "@/app/auth";
import { verifyToken } from "@/_utils/jwt";
import prisma from "@/_lib/database/prisma";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        prisma.$disconnect();
        res.status(405).json({ error: "Method not allowed", status: 405 });
        return;
    }

    try {
        let user;
        var { username } = req.body;
        try {
            user = await prisma.user.findUnique({
                where: {
                    uniqueName: username,
                },
                include: {
                    email: false,
                    Leaderboard: true,
                    settings: true,
                },
            });
        } catch (error) {
            console.log(error);
            user = null;
        }
        if (user === null) {
            res.status(200).json({
                status: 404,
                error: "User not found",
            });
        } else {
            if (user.settings === null) {
                console.log(user.settings === null);
                user = await prisma.user.update({
                    where: {
                        uniqueName: username,
                    },
                    data: {
                        settings: {
                            create: {},
                        },
                    },
                });
            }
            res.status(200).json({
                user,
                status: 200,
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

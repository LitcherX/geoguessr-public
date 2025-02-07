import { auth } from "@/app/auth";
import prisma from "@/_lib/database/prisma";
import updateBoard from "@/_lib/functions/leaderboard";
import { sendDiscordNotification } from "@/_lib/functions/notifications"; // Import the new utility function

async function checkRanks(oldData, newData) {
    oldData.forEach((d, i) => {
        if (newData[i].userId !== d.userId) {
            if (d.user.settings?.emailNotification) {
                console.log("Email");
            } else if (d.user.settings?.discordNotification) {
                sendDiscordNotification(
                    d.user.accounts[0].providerAccountId,
                    "Your notification!",
                    d.user.image,
                    i + 1,
                    i
                );
            }
        }
    });
}

export default async function handler(req, res) {
    const session = await auth(req, res);
    try {
        if (req.method === "GET") {
            let board = await prisma.leaderboard.findMany({
                orderBy: {
                    rank: "asc",
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                            lobbyId: true,
                            banned: true,
                            county: true,
                            playsEver: true,
                            scoreEver: true,
                            timeEver: true,
                            uniqueName: true,
                        },
                    },
                },
            });
            prisma.$disconnect();
            return res.status(200).json({ board, msg: "success" });
        }
        if (req.method === "POST") {
            if (!session?.user) {
                prisma.$disconnect();
                res.status(401).json({
                    error: "Not authenticated",
                    status: 401,
                });
                throw new Error("Not authenticated");
            }
            if (session.user.baned) {
                prisma.$disconnect();
                res.status(403).json({ error: "You are banned", status: 403 });
                throw new Error("You are banned");
            }
            const { scoreAdd } = req.body;
            let scoreAdd2 = Number(scoreAdd);
            let scoreEver = scoreAdd2 + Number(session.user.scoreEver);
            let playsEver = Number(session.user.playsEver) + 1;
            let score = scoreEver / playsEver;
            const oldData = await prisma.leaderboard.findMany({
                take: 10,
                orderBy: {
                    rank: "asc",
                },
                include: {
                    user: {
                        include: {
                            settings: true,
                            accounts: true,
                        },
                    },
                },
            });
            await updateBoard(prisma, session.user.id, score);
            const newData = await prisma.leaderboard.findMany({
                take: 10,
                orderBy: {
                    rank: "asc",
                },
            });
            await checkRanks(oldData, newData);
            prisma.$disconnect();
            return res.status(200).json({
                status: 200,
                msg: "Updated",
            });
        } else {
            prisma.$disconnect();
            res.status(405).json({ error: "Method not allowed", status: 405 });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            error: error.message,
        });
    }
    prisma.$disconnect();
}

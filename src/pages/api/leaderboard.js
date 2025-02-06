import { auth } from "@/app/auth";
import { verifyToken } from "@/_utils/jwt";
import prisma from "@/_lib/database/prisma";
import updateBoard from "@/_lib/functions/leaderboard";

async function checkRanks(oldData, newData) {
    oldData.forEach((d, i) => {
        if (newData[i].userId !== d.userId) {
            if (d.user.settings?.emailNotification) {
                console.log("Email");
            } else if (d.user.settings?.discordNotification) {
                async function sendDiscordNotification(userId, message) {
                    try {
                        const dmChannelResponse = await fetch(
                            `https://discord.com/api/v10/users/@me/channels`,
                            {
                                method: "POST",
                                headers: {
                                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ recipient_id: userId }),
                            }
                        );

                        const dmChannel = await dmChannelResponse.json();

                        if (!dmChannel.id) {
                            console.error(
                                "Failed to create DM channel:",
                                dmChannel
                            ); // Handle errors
                            return;
                        }

                        const avatarImage = await fetch(d.user.image);

                        const embed = {
                            title: "Oh no, someone passed you",
                            description: message,
                            color: 0x8b0000,
                            timestamp: new Date(),
                            footer: {
                                text: "If you wish to disable notifications, head to https://geoguess.gamrtag.xyz/me",
                            },
                            fields: [
                                {
                                    name: "New Rank",
                                    value: `Your new rank is ${i + 1}`, // Replace X with the actual rank
                                    inline: true,
                                },
                                {
                                    name: "Previous Rank",
                                    value: `Your previous rank was ${i}`, // Replace Y with the actual previous rank
                                    inline: true,
                                },
                            ],
                            thumbnail: {
                                url:
                                    avatarImage.status === 200
                                        ? d.user.image
                                        : "https://geoguess.gamrtag.xyz/images/placeholder.png",
                            },
                        };

                        // 2. Send Message
                        const messageResponse = await fetch(
                            `https://discord.com/api/v10/channels/${dmChannel.id}/messages`,
                            {
                                method: "POST",
                                headers: {
                                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    embeds: [embed],
                                    contents: "New notification!",
                                }),
                            }
                        );

                        if (!messageResponse.ok) {
                            const errorData = await messageResponse.json();
                            console.error("Failed to send message:", errorData); // Handle errors
                            return;
                        }

                        console.log("Notification sent!");
                    } catch (error) {
                        console.error("Error:", error);
                    }
                }
                sendDiscordNotification(
                    d.user.accounts[0].providerAccountId,
                    "Your notification!"
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

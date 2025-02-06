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
        var { count, joinCode, started, results, ended } = req.body;
        let lobby;
        try {
            lobby = await prisma.lobby.findUnique({
                where: {
                    joinCode: parseInt(joinCode),
                },
            });
        } catch (error) {
            lobby = null;
        }
        if (results) {
            lobby = await prisma.lobby.update({
                where: {
                    joinCode: parseInt(joinCode),
                },
                data: {
                    results:
                        results.length === 0
                            ? []
                            : results.length === 1
                            ? [
                                  ...(lobby.results || []),
                                  JSON.stringify(results),
                              ]
                            : [
                                  ...(lobby.results || []),
                                  ...results.map((r) => JSON.stringify(r)),
                              ],
                },
            });
            res.status(200).json({ lobby: lobby, status: 200 });
        }
        if (lobby) {
            lobby = await prisma.lobby.update({
                where: {
                    joinCode: parseInt(joinCode),
                    ownerId: session.user.id,
                },
                data: {
                    ...(count !== undefined ? { count: parseInt(count) } : {}),
                    ...(started !== undefined ? { started: started } : {}),
                    ...(ended !== undefined ? { ended: ended } : {}),
                },
            });
            res.status(200).json({ lobby: lobby, status: 200 });
        } else {
            res.status(404).json({
                error: `Lobby not found`,
                status: 404,
            });
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

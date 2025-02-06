export default async function updateBoard(prisma, userId, score) {
    async function updateLeaderboardRanks(batchSize = 1000) {
        let offset = 0;
        let hasMore = true;

        // Reset ranks to avoid unique constraint violation
        await prisma.leaderboard.updateMany({
            data: { rank: null },
        });

        while (hasMore) {
            // Fetch a batch of leaderboard entries, sorted by score in ascending order
            const leaderboardEntries = await prisma.leaderboard.findMany({
                orderBy: { score: "asc" },
                skip: offset,
                take: batchSize,
                select: { userId: true, score: true },
            });

            if (leaderboardEntries.length === 0) {
                hasMore = false;
                break;
            }

            // Prepare batch update
            const updates = leaderboardEntries.map((entry, index) => ({
                where: { userId: entry.userId },
                data: { rank: offset + index + 1 },
            }));

            // Perform batch update
            await prisma.$transaction(
                updates.map((u) =>
                    prisma.leaderboard.update({
                        where: { userId: u.where.userId },
                        data: { rank: u.data.rank },
                    })
                )
            );

            offset += batchSize;
        }
    }

    async function createOrUpdateLeaderboardEntry(userId, score) {
        await prisma.$transaction(async (tx) => {
            // Update or create leaderboard entry
            await tx.leaderboard.upsert({
                where: { userId },
                update: { score },
                create: { userId, score },
            });
        });
    }

    await createOrUpdateLeaderboardEntry(userId, score);
    await updateLeaderboardRanks();
}

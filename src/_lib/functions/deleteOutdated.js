import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const hours = 2;
    const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    try {
        await prisma.$executeRaw`
      DELETE FROM "Lobbies"
      WHERE "lastUpdated" < ${cutoffDate};
    `;
        res.status(200).json({ message: "Old records deleted successfully." });
    } catch (err) {
        console.error("Error deleting old records:", err);
        res.status(500).json({ error: "Error deleting old records." });
    } finally {
        await prisma.$disconnect();
    }
}

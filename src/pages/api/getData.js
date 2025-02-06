import { auth } from "@/app/auth";
import { verifyToken } from "@/_utils/jwt";
import prisma from "@/_lib/database/prisma";
import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        prisma.$disconnect();
        res.status(405).json({ error: "Method not allowed", status: 405 });
        return;
    }

    try {
        const { order } = req.body;
        const dataArray = [];
        await loadData(order, dataArray);
        res.status(200).json(dataArray);
    } catch (error) {
        res.status(500).json({
            error: error.message,
            status: 500,
        });
    }
    prisma.$disconnect();
}

async function loadData(order, dataArray) {
    for (let i = 0; i <= order.length - 1; i++) {
        const filePath = path.join(
            process.cwd(),
            "public",
            "guess",
            `${order[i]}`,
            "data.json"
        );
        const fileContent = await fs.readFile(filePath, "utf8");
        const jsonData = JSON.parse(fileContent);

        dataArray.push(jsonData);
    }
}

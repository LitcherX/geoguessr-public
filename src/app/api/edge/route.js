import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

export const runtime = "edge";

export async function GET(request) {
    const neon = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaNeon(neon);
    const prisma = new PrismaClient({ adapter });

    const users = await prisma.user.findMany();

    return NextResponse.json(users, { status: 200 });
}

"use client";
import React from "react";
import * as fs from "node:fs";
import path from "path";
import { auth } from "@/app/auth";
import { generateToken } from "@/_utils/jwt";
import Game from "@/_lib/components/game";
import LayoutOne from "@/_lib/layouts/layoutOne";

export async function getServerSideProps(ctx) {
    const session = await auth(ctx);
    const token = generateToken(session?.user.id);
    const dirPath = path.join(process.cwd(), "public", "guess");
    const entries = fs.readdirSync(dirPath);
    let folders = entries.filter((entry) =>
        fs.statSync(path.join(dirPath, entry)).isDirectory()
    );
    folders = folders.filter((item) => item !== "0");
    return {
        props: {
            auth: session,
            token,
            folders,
        },
    };
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page({ folders, token, auth }) {
    return (
        <>
            <Game
                multiplayer={false}
                gameMode={"casual"}
                folders={folders}
                user={auth}
                token={token}
            />
        </>
    );
}

Page.getLayout = function getLayout(page) {
    return <LayoutOne>{page}</LayoutOne>;
};

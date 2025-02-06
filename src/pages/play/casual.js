"use client";
import React from "react";
import * as fs from "node:fs";
import path from "path";
import LayoutTwo from "@lib/layouts/layoutTwo.js";
import Game from "@/_lib/components/game";
import getFolders from "@/_lib/functions/getFolders";

export async function getServerSideProps() {
    const folders = await getFolders(fs, path);
    return {
        props: {
            folders,
        },
    };
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page({ folders }) {
    return (
        <>
            <Game folders={folders} multiplayer={false} />
        </>
    );
}

Page.getLayout = function getLayout(page) {
    return <LayoutTwo>{page}</LayoutTwo>;
};

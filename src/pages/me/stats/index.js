"use client";

import LayoutProfile from "@/_lib/layouts/layoutProfile";
import { auth } from "@/app/auth";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { generateToken } from "@/_utils/jwt";
import { apiCall } from "@/_lib/components/global";
import { useState } from "react";
import LayoutSidebar from "@/_lib/layouts/layoutSidebar";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page(props) {
    const { data } = props;
    const { user } = data;
    return (
        <LayoutSidebar data={data}>
            <div>
                <h3>Statistics</h3>
            </div>
            <div>
                Coming soon once I have a big enough VPN to store and fetch
                data...
            </div>
        </LayoutSidebar>
    );
}

Page.getLayout = function getLayout(page, pageProps) {
    return <LayoutProfile>{page}</LayoutProfile>;
};

export async function getServerSideProps(ctx) {
    const session = await auth(ctx);
    const { req } = ctx;
    if (!session) {
        return {
            redirect: { destination: "/api/auth/signin", permanent: false },
        };
    }
    // Extract headers
    const headers = {};
    Object.keys(req.headers).forEach((key) => {
        headers[key.toLowerCase()] = req.headers[key];
    });
    const data = await apiCall(
        "getUser",
        "POST",
        { server: true, headers },
        { username: session.user.uniqueName }
    );
    return {
        props: {
            data,
        },
    };
}

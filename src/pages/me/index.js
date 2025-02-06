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
    console.log(props);
    const { data } = props;
    const { user } = data;
    return (
        <LayoutSidebar data={data}>
            <div>
                <h3>Your Profile</h3>
            </div>
            <div>
                <div className=" flex gap-16 flex-row items-center flex-wrap max-[800px]:justify-center">
                    <div className="flex w-[150px] h-auto flex-wrap">
                        <Image
                            src={user.image}
                            width={150}
                            height={150}
                            alt={`Profile picture`}
                            className=" rounded-full"
                        />
                        <div className=" absolute w-[150px] h-[150px] flex items-end justify-end flex-wrap">
                            <Tooltip id="my-tooltip" />

                            <div
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content={
                                    user.lobbyId === null
                                        ? `Last seen: ${new Date(
                                              user.updatedAt
                                          ).toLocaleString()}`
                                        : `Currently In-game`
                                }
                                data-tooltip-place="top"
                                suppressHydrationWarning
                                className={`w-[25px] h-[25px] ${
                                    user.lobbyId === null
                                        ? " bg-red-700"
                                        : " bg-green-700"
                                } rounded-full -translate-x-3 -translate-y-3 border-background border-[4px]`}
                            ></div>
                        </div>
                    </div>
                    <div className=" flex flex-col w-max items-center gap-6 flex-wrap">
                        <div className=" flex flex-row gap-5 flex-wrap max-[600px]:justify-center">
                            <div className=" items-center justify-center flex flex-col flex-wrap">
                                <p>
                                    {(
                                        Number(user?.scoreEver) /
                                        Number(user?.playsEver)
                                    ).toFixed(2)}
                                </p>
                                <h6>Avg. Points</h6>
                            </div>
                            <div className=" items-center justify-center flex flex-col">
                                <p>
                                    {(user?.timeEver / user?.playsEver).toFixed(
                                        2
                                    )}
                                    s
                                </p>
                                <h6>Avg. Time</h6>
                            </div>
                            <div className=" items-center justify-center flex flex-col">
                                <p>{user?.playsEver}</p>
                                <h6>All Plays</h6>
                            </div>
                        </div>
                        <div className=" flex flex-row justify-around w-full">
                            <p>
                                {data.user.Leaderboard
                                    ? `Ranked #${data.user.Leaderboard.rank} Globally`
                                    : "Can't decide rank"}
                            </p>
                        </div>
                    </div>
                </div>
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

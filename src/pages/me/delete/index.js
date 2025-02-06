"use client";

import LayoutProfile from "@/_lib/layouts/layoutProfile";
import { auth } from "@/app/auth";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { generateToken } from "@/_utils/jwt";
import { apiCall } from "@/_lib/components/global";
import { useState } from "react";
import LayoutSidebar from "@/_lib/layouts/layoutSidebar";
import { ToastContainer, toast } from "react-toastify";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page(props) {
    const { data } = props;
    const { user } = data;
    async function saveData(username) {
        const id = toast.loading("Please wait...", {
            autoClose: false,
            position: "bottom-right",
        });
        const res = await apiCall("updateUser", "POST", "", { rem: true });
        if (res.status === 200) {
            toast.update(id, {
                render: "Account deleted!",
                type: "success",
                autoClose: 2000,
                closeOnClick: true,
                isLoading: false,
            });
            window.location.reload();
        } else {
            toast.update(id, {
                render: "Internal error",
                type: "error",
                autoClose: 2000,
                closeOnClick: true,
                isLoading: false,
            });
        }
    }
    return (
        <LayoutSidebar data={data}>
            <div>
                <h3>Delete Account</h3>
            </div>
            <div className=" flex flex-col gap-6">
                <h1 className=" animate-pulse text-red-700">
                    READ BEFORE PROCEEDING
                </h1>
                <p>
                    Deleting your account is irreverseable. All of your user
                    data will be erased from all of our databases.
                </p>
                <p>This data includes:</p>
                <ul className=" list-disc ml-[30px] -mt-[25px]">
                    <li>Your Discord account information</li>
                    <li>All lobbies you have created</li>
                    <li>All past scores</li>
                    <li>Your username will be available for anyone</li>
                </ul>
                <div className=" flex justify-center">
                    <button
                        onClick={async (e) => {
                            e.preventDefault();
                            await saveData();
                        }}
                        className=" text-xl px-[10px] py-[5px] rounded-xl bg-red-800 opacity-85 hover:opacity-100 w-fit"
                    >
                        Proceed
                    </button>
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

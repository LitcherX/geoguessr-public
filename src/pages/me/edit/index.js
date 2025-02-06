"use client";

import LayoutProfile from "@/_lib/layouts/layoutProfile";
import { auth } from "@/app/auth";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { generateToken } from "@/_utils/jwt";
import { apiCall } from "@/_lib/components/global";
import { useEffect, useState } from "react";
import LayoutSidebar from "@/_lib/layouts/layoutSidebar";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMailBulk } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page({
    data,
    data: { user },
    data: {
        user: { settings },
    },
}) {
    const [emailNotification, setEmailNotification] = useState(
        settings.emailNotification
    );
    const [discordNotification, setDiscordNotification] = useState(
        settings.discordNotification
    );
    const [username, setUsername] = useState(user.uniqueName);
    const [displayname, setDisplayname] = useState(user.name);
    const [userData, setUserData] = useState(data);
    const [warningToast, setWarningToast] = useState();
    async function saveData(e) {
        const settings = { emailNotification, discordNotification };
        const id = toast.loading("Please wait...", {
            autoClose: false,
            position: "bottom-right",
        });
        if (username !== userData.user.uniqueName) {
            const check = await apiCall("getUser", "POST", "", { username });
            if (check.status !== 404) {
                toast.update(id, {
                    render: "This username is already taken!",
                    type: "error",
                    autoClose: 2000,
                    closeOnClick: true,
                    isLoading: false,
                });
                return;
            }
        }
        const res = await apiCall("updateUser", "POST", "", {
            ...(username !== userData.user.uniqueName ? { username } : {}),
            ...(displayname !== userData.user.name ? { displayname } : {}),
            ...(settings ? { settings } : {}),
        });
        if (res.status === 200) {
            setUserData(res);
            e.target[0].placeholder = username;
            e.target[1].placeholder = displayname;
            e.target[0].value = "";
            e.target[1].value = "";
            toast.update(id, {
                render: "Account updated successfully!",
                type: "success",
                autoClose: 2000,
                closeOnClick: true,
                isLoading: false,
            });
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
    useEffect(() => {
        if (
            emailNotification !== userData.user.settings.emailNotification ||
            discordNotification !==
                userData.user.settings.discordNotification ||
            username !== userData.user.uniqueName ||
            displayname !== userData.user.name
        ) {
            if (!warningToast) {
                setWarningToast(
                    toast.loading("You have unsaved settings...", {
                        autoClose: false,
                        position: "bottom-right",
                    })
                );
            }
        } else {
            toast.dismiss(warningToast);
            setWarningToast();
        }
    }, [
        emailNotification,
        discordNotification,
        username,
        displayname,
        userData,
    ]);
    return (
        <LayoutSidebar data={userData}>
            <ToastContainer theme="colored" />
            <div>
                <h3>Edit Profile</h3>
            </div>
            <form
                className=" flex flex-col gap-6"
                onSubmit={async (e) => {
                    e.preventDefault();
                    await saveData(e);
                }}
            >
                <div className=" flex flex-row gap-6">
                    Change username:
                    <input
                        placeholder={user.uniqueName}
                        className=" bg-background-50 border-primary border-[1px] rounded-full px-[10px] w-[100px]"
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    ></input>
                </div>
                <div className=" flex flex-row gap-6">
                    Change displayname:
                    <input
                        placeholder={user.name}
                        className=" bg-background-50 border-primary border-[1px] rounded-full px-[10px] w-[100px]"
                        onChange={(e) => {
                            setDisplayname(e.target.value);
                        }}
                    ></input>
                </div>
                <div className="flex flex-row gap-4">
                    <div
                        onClick={() => {
                            setEmailNotification(!emailNotification);
                        }}
                        className={`p-[15px] rounded-xl group border-[3px] text-text-60 hover:text-text hover:border-primary flex flex-col gap-4 items-center w-[150px] transition-all hover:cursor-pointer h-fit ${
                            emailNotification
                                ? "border-primary !text-text"
                                : "border-primary-40 text-text-60"
                        }`}
                    >
                        <FontAwesomeIcon
                            icon={faMailBulk}
                            width={50}
                            height={50}
                            className="w-[50px] h-[50px]"
                        />
                        <p className="text-center text-wrap">
                            Email Notifications
                        </p>
                        <span
                            className={`w-[15px] h-[15px] absolute mr-[96px] rounded-full group-hover:border-primary group-hover:bg-primary-80 border-[2px] ${
                                emailNotification
                                    ? "bg-primary-80 border-primary"
                                    : "bg-primary-40 border-primary-30"
                            }`}
                        />
                    </div>
                    <div
                        onClick={() => {
                            setDiscordNotification(!discordNotification);
                        }}
                        className={`p-[15px] rounded-xl group border-[3px] text-text-60 hover:text-text hover:border-primary flex flex-col gap-4 items-center w-[150px] transition-all hover:cursor-pointer h-fit ${
                            discordNotification
                                ? "border-primary !text-text"
                                : "border-primary-40 text-text-60"
                        }`}
                    >
                        <FontAwesomeIcon
                            icon={faDiscord}
                            width={50}
                            height={50}
                            className="w-[50px] h-[50px]"
                        />
                        <p className="text-center text-wrap">
                            Discord Notifications
                        </p>
                        <span
                            className={`w-[15px] h-[15px] absolute mr-[96px] rounded-full group-hover:border-primary group-hover:bg-primary-80 border-[2px] ${
                                discordNotification
                                    ? "bg-primary-80 border-primary"
                                    : "bg-primary-40 border-primary-30"
                            }`}
                        />
                    </div>
                </div>
                <div className="  h-auto flex flex-row justify-center">
                    <button className=" w-fit px-[10px] py-[5px] bg-primary opacity-75 hover:opacity-100 rounded-xl text-xl">
                        Save
                    </button>
                </div>
            </form>
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

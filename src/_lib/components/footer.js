"use client";
import Link from "next/link";
import React from "react";
import useDarkMode from "../functions/useDarkmode";
import logo from "@public/images/logo.png";
import Image from "next/image";
import ThemeButton from "./theme";
export default function Footer({ request }) {
    const [theme, setTheme] = useDarkMode();
    return (
        <div className="w-[1100px] mb-[15px] max-w-[100vw] pb-[15px] flex flex-row flex-wrap px-[15px]">
            <div className="flex flex-row flex-wrap gap-3 justify-evenly w-full">
                <div className="flex flex-col gap-3 items-center">
                    <Link
                        href="/"
                        className="text-primary font-medium hover:cursor-pointer hover:text-primary-50 transition-all"
                    >
                        <Image src={logo} width={150} alt="logo" />
                    </Link>
                    <div>
                        <div className="px-[10px] py-[5px] rounded-lg flex items-center gap-2 text-primary font-medium transition-colors duration-300 hover:cursor-pointer hover:bg-primary-30 group">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 10 10"
                                width={13}
                                height={13}
                                className={`animate-ping absolute`}
                            >
                                <circle
                                    cx="5"
                                    cy="5"
                                    r="4.5"
                                    style={{
                                        fill: "rgba(0,0,0,0)",
                                        strokeWidth: "1px",
                                    }}
                                    className="stroke-primary group-hover:stroke-primary transition-all duration-300"
                                />
                                <circle
                                    cx="5"
                                    cy="5"
                                    r="3"
                                    className="fill-primary group-hover:fill-primary transition-all duration-300"
                                />
                            </svg>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 10 10"
                                width={13}
                                height={13}
                                className=""
                            >
                                <circle
                                    cx="5"
                                    cy="5"
                                    r="4.5"
                                    style={{
                                        fill: "rgba(0,0,0,0)",
                                        strokeWidth: "1px",
                                    }}
                                    className="stroke-primary group-hover:stroke-primary transition-all duration-300"
                                />
                                <circle
                                    cx="5"
                                    cy="5"
                                    r="3"
                                    className="fill-primary group-hover:fill-primary transition-all duration-300"
                                />
                            </svg>
                            <p>All systems normal.</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3 items-start">
                    <p className=" font-medium">Links</p>
                    <div className="flex gap-6 flex-wrap justify-center">
                        <Link
                            href="/"
                            className=" text-text-50 fill-text-50 stroke-text-50 hover:text-text hover:fill-text hover:stroke-text hover:cursor-pointer transition-all flex items-center gap-1"
                        >
                            Home
                        </Link>
                        <Link
                            href="/leaderboard"
                            className=" text-text-50 fill-text-50 stroke-text-50 hover:text-text hover:fill-text hover:stroke-text hover:cursor-pointer transition-all flex items-center gap-1"
                        >
                            Leaderboard
                        </Link>
                        <Link
                            href="/api/auth/signin"
                            className=" text-text-50 fill-text-50 stroke-text-50 hover:text-text hover:fill-text hover:stroke-text hover:cursor-pointer transition-all flex items-center gap-1"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/me"
                            className=" text-text-50 fill-text-50 stroke-text-50 hover:text-text hover:fill-text hover:stroke-text hover:cursor-pointer transition-all flex items-center gap-1"
                        >
                            Account Manager
                        </Link>
                    </div>
                    <div className="flex gap-6 flex-wrap justify-center">
                        <Link
                            href="https://emergency-response-liberty-county.fandom.com"
                            target="blank"
                            className=" text-text-50 fill-text-50 stroke-text-50 hover:text-text hover:fill-text hover:stroke-text hover:cursor-pointer transition-all flex items-center gap-1"
                        >
                            ER:LC Wiki
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                className=" fill-none w-[15px] h-[15px]"
                            >
                                <path d="M15,3h6V9" />
                                <path d="M10,14,21,3" />
                                <path d="M12.94,6.21H4.18A2.38,2.38,0,0,0,1.79,8.59V19.82a2.39,2.39,0,0,0,2.39,2.39H15.41a2.38,2.38,0,0,0,2.38-2.39V11.18" />
                            </svg>
                        </Link>
                        <Link
                            href="https://discord.gg/prc"
                            target="blank"
                            className=" text-text-50 fill-text-50 stroke-text-50 hover:text-text hover:fill-text hover:stroke-text hover:cursor-pointer transition-all flex items-center gap-1"
                        >
                            PRC Discord
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                className="  fill-none w-[15px] h-[15px]"
                            >
                                <path d="M15,3h6V9" />
                                <path d="M10,14,21,3" />
                                <path d="M12.94,6.21H4.18A2.38,2.38,0,0,0,1.79,8.59V19.82a2.39,2.39,0,0,0,2.39,2.39H15.41a2.38,2.38,0,0,0,2.38-2.39V11.18" />
                            </svg>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col gap-3 items-center">
                    <p className=" font-medium">Preferences</p>
                    <ThemeButton theme={theme} setTheme={setTheme} />
                </div>
            </div>
        </div>
    );
}

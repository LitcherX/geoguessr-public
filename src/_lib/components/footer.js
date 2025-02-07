"use client";
import Link from "next/link";
import React from "react";
import useDarkMode from "../functions/useDarkmode";
import logo from "@public/images/logo.png";
import Image from "next/image";
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
                    <div
                        className={`w-[84px] h-[28px] flex items-center rounded-full bg-background border-text border-[0.5px] !border-opacity-20 ${
                            theme === "dark" ? "!border-r-opacity-100" : ""
                        }`}
                    >
                        <button
                            className={`w-[28px] h-[28px] flex justify-center items-center border-r-[0.5px] border-t-[0.5px] border-b-[0.5px] rounded-full ${
                                theme === "dark"
                                    ? " border-text !border-opacity-20"
                                    : " border-transparent opacity-55 "
                            }`}
                            onClick={(e) => {
                                setTheme("dark");
                            }}
                        >
                            <svg
                                height="16"
                                strokeLinejoin="round"
                                viewBox="0 0 16 16"
                                width="16"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M1.5 8.00005C1.5 5.53089 2.99198 3.40932 5.12349 2.48889C4.88136 3.19858 4.75 3.95936 4.75 4.7501C4.75 8.61609 7.88401 11.7501 11.75 11.7501C11.8995 11.7501 12.048 11.7454 12.1953 11.7361C11.0955 13.1164 9.40047 14.0001 7.5 14.0001C4.18629 14.0001 1.5 11.3138 1.5 8.00005ZM6.41706 0.577759C2.78784 1.1031 0 4.22536 0 8.00005C0 12.1422 3.35786 15.5001 7.5 15.5001C10.5798 15.5001 13.2244 13.6438 14.3792 10.9921L13.4588 9.9797C12.9218 10.155 12.3478 10.2501 11.75 10.2501C8.71243 10.2501 6.25 7.78767 6.25 4.7501C6.25 3.63431 6.58146 2.59823 7.15111 1.73217L6.41706 0.577759ZM13.25 1V1.75V2.75L14.25 2.75H15V4.25H14.25H13.25V5.25V6H11.75V5.25V4.25H10.75L10 4.25V2.75H10.75L11.75 2.75V1.75V1H13.25Z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </button>
                        <button
                            className={`w-[28px] h-[28px] flex justify-center items-center border-[0.5px] rounded-full ${
                                theme === "light"
                                    ? " border-text !border-opacity-20"
                                    : " border-transparent opacity-55 "
                            }`}
                            onClick={(e) => {
                                setTheme("light");
                            }}
                        >
                            <svg
                                height="16"
                                strokeLinejoin="round"
                                viewBox="0 0 16 16"
                                width="16"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M8.75 0.75V0H7.25V0.75V2V2.75H8.75V2V0.75ZM11.182 3.75732L11.7123 3.22699L12.0659 2.87344L12.5962 2.34311L13.6569 3.40377L13.1265 3.9341L12.773 4.28765L12.2426 4.81798L11.182 3.75732ZM8 10.5C9.38071 10.5 10.5 9.38071 10.5 8C10.5 6.61929 9.38071 5.5 8 5.5C6.61929 5.5 5.5 6.61929 5.5 8C5.5 9.38071 6.61929 10.5 8 10.5ZM8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12ZM13.25 7.25H14H15.25H16V8.75H15.25H14H13.25V7.25ZM0.75 7.25H0V8.75H0.75H2H2.75V7.25H2H0.75ZM2.87348 12.0659L2.34315 12.5962L3.40381 13.6569L3.93414 13.1265L4.28769 12.773L4.81802 12.2426L3.75736 11.182L3.22703 11.7123L2.87348 12.0659ZM3.75735 4.81798L3.22702 4.28765L2.87347 3.9341L2.34314 3.40377L3.4038 2.34311L3.93413 2.87344L4.28768 3.22699L4.81802 3.75732L3.75735 4.81798ZM12.0659 13.1265L12.5962 13.6569L13.6569 12.5962L13.1265 12.0659L12.773 11.7123L12.2426 11.182L11.182 12.2426L11.7123 12.773L12.0659 13.1265ZM8.75 13.25V14V15.25V16H7.25V15.25V14V13.25H8.75Z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </button>
                        <button
                            className={`w-[28px] h-[28px] flex justify-center items-center border-l-[0.5px] border-t-[0.5px] border-b-[0.5px] rounded-full ${
                                theme === "auto"
                                    ? " border-text !border-opacity-20"
                                    : " border-transparent opacity-55 "
                            }`}
                            onClick={(e) => {
                                setTheme("auto");
                            }}
                        >
                            <svg
                                height="16"
                                strokeLinejoin="round"
                                viewBox="0 0 16 16"
                                width="16"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M1 3.25C1 1.45507 2.45507 0 4.25 0H11.75C13.5449 0 15 1.45507 15 3.25V15.25V16H14.25H1.75H1V15.25V3.25ZM4.25 1.5C3.2835 1.5 2.5 2.2835 2.5 3.25V14.5H13.5V3.25C13.5 2.2835 12.7165 1.5 11.75 1.5H4.25ZM4 4C4 3.44772 4.44772 3 5 3H11C11.5523 3 12 3.44772 12 4V10H4V4ZM9 13H12V11.5H9V13Z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

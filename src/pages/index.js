"use client";
import LayoutOne from "@lib/layouts/layoutOne";
import Link from "next/link";
import logo from "@public/images/logo.png";
import Image from "next/image";

export async function getServerSideProps(ctx) {
    return {
        props: {
            data: null,
        },
    };
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page() {
    return (
        <div className="w-full flex h-full items-center justify-center flex-col gap-[80px] px-[15px]">
            <div className="flex flex-col justify-center items-center">
                <p className="text-center text-xl">
                    Ever wanted a GeoGuessr for ERLC? Well here is one!
                </p>
                <Image
                    src={logo}
                    alt="ERLC GeoGuessr Logo"
                    className=" max-w-[100vw] w-[500px] px-[15px]"
                />
                <p className=" italic text-sm">Made by Adam</p>
                <Link
                    href="https://discord.gg/dN4xf2McSp"
                    className=" font-bold text-[#115ea3] dark:text-[#479ef5] hover:text-[#0f548c] dark:hover:text-[#62abf5] hover:underline"
                >
                    Visit my Discord server
                </Link>
            </div>
        </div>
    );
}

Page.getLayout = function getLayout(page) {
    return <LayoutOne>{page}</LayoutOne>;
};

"use client";
import LayoutOne from "@lib/layouts/layoutOne";
import Link from "next/link";

export async function getServerSideProps(ctx) {
    return {
        props: {
            data: null,
        },
    };
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page(props) {
    return (
        <div className="w-full flex h-full items-center justify-center flex-col gap-[80px] px-[15px]">
            <div className="flex flex-col justify-center items-center">
                <p className="text-center text-xl">
                    Ever wanted a GeoGuessr for ERLC? Well here is one!
                </p>
                <h1>ERLC GeoGuessr</h1>
                <p className=" italic text-sm">Made by Adam</p>
                <Link
                    href="https://discord.gg/dN4xf2McSp"
                    className=" font-bold text-[#115ea3] dark:text-[#479ef5] hover:text-[#0f548c] dark:hover:text-[#62abf5] hover:underline"
                >
                    My Projects Discord server
                </Link>
            </div>
            <div className="w-full flex flex-col gap-4 bg-dark shadow-around shadow-text-20 bg-background p-[15px] rounded-xl">
                <div>
                    <h4 className="text-center">IMPORTANT</h4>
                    <p>
                        If you&apos;d like to support this, and my other
                        projects feel free to do it on{" "}
                        <Link
                            href="https://buymeacoffee.com/adamdev"
                            className="text-[#115ea3] dark:text-[#479ef5] hover:text-[#0f548c] dark:hover:text-[#62abf5] hover:underline"
                        >
                            this link
                        </Link>{" "}
                    </p>
                </div>
                <div>
                    <h4 className="text-center">DISCLAMER</h4>
                    <p>
                        This website is still under development, if you wish to
                        support us, you may by sending random images from the
                        in-game map, with a pinpoint on where that spot is on
                        the map.
                    </p>
                    <p>
                        The site is being maintained in my free time, so
                        don&apos;t expect it to be updated frequently. When I
                        have time and motivation, I will work on this project.
                    </p>
                    <p>
                        The website is mostly made for PC and Laptop. It may not
                        work on other devices as intended.
                    </p>
                    <p>This site uses cookies for it's core functionalities.</p>{" "}
                    {/* QUIZZEZ SOON?! */}
                    <p>
                        If you have any recommendations, feel free to DM me on
                        Discord @_as.
                    </p>
                </div>
            </div>
        </div>
    );
}

Page.getLayout = function getLayout(page) {
    return <LayoutOne>{page}</LayoutOne>;
};

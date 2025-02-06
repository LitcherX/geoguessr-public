import { apiCall } from "@/_lib/components/global";
import LayoutOne from "@/_lib/layouts/layoutOne";
import { auth } from "@/app/auth";
import Image from "next/image";
import * as React from "react";
import placeholder from "@public/images/placeholder.png";
import { useState } from "react";
import { useRouter } from "next/router";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page({ data, authed }) {
    const router = useRouter();
    React.useEffect(() => {
        console.log(data, authed);
    }, []);
    function LeaderBoard() {
        return (
            <div>
                <h1 className="text-center pb-[30px]">Leader Board</h1>
                <div className="flex gap-2 flex-col items-start w-[400px] text-xl max-md:text-base max-md:w-[325px]">
                    {data.board.map((item, index) => {
                        const [imgSrc, setImgSrc] = useState(item.user.image);

                        return (
                            <div
                                key={index}
                                className={`hover:cursor-pointer flex flex-row items-center gap-4 w-full hover:bg-primary-30 py-[4px] px-[10px] rounded-lg ${
                                    index === 0
                                        ? "text-gold scale-125 mb-[8px] max-md:scale-100"
                                        : index === 1
                                        ? "text-silver scale-110 mb-[6px] max-md:scale-100"
                                        : index === 2
                                        ? " text-bronze scale-105 mb-[3px] max-md:scale-100"
                                        : " text-text"
                                }`}
                                onClick={() =>
                                    router.push(`/@${item.user.uniqueName}`)
                                }
                            >
                                <div className=" w-min">{index + 1}</div>
                                <div className="flex items-center gap-2 w-full">
                                    <Image
                                        src={imgSrc}
                                        width={35}
                                        height={35}
                                        className="rounded-full max-md:w-[20px] max-md:h-[20px]"
                                        onError={(e) => {
                                            e.preventDefault();
                                            setImgSrc(placeholder);
                                        }}
                                        alt={item.user.name}
                                    />
                                    <p>{item.user.name}</p>
                                </div>
                                <div className="w-min">
                                    {Number(item.score).toFixed(2)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
    return (
        <div className=" max-w-[100vw] w-max">
            <LeaderBoard />
        </div>
    );
}

export async function getServerSideProps(ctx) {
    const authed = await auth(ctx);
    const { req } = ctx;
    const headers = {};
    Object.keys(req.headers).forEach((key) => {
        headers[key.toLowerCase()] = req.headers[key];
    });
    const data = await apiCall("leaderboard", "GET", { server: true, headers });
    return {
        props: {
            data,
            authed,
        },
    };
}

Page.getLayout = function getLayout(page) {
    return <LayoutOne>{page}</LayoutOne>;
};

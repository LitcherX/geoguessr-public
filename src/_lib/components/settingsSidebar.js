import { auth } from "@/app/auth";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
const settings = [
    {
        value: "Edit Account",
        image: <FontAwesomeIcon icon={faCogs} />,
        url: "/me/edit",
        color: "white",
    },
    {
        value: "Statistics",
        image: <FontAwesomeIcon icon={faChartSimple} />,
        url: "/me/stats",
        color: "white",
    },
    {
        value: "Delete Account",
        image: <FontAwesomeIcon icon={faTrashCan} />,
        url: "/me/delete",
        color: "red",
    },
];

export default function Sidebar({ user }) {
    const LoadSettings = () => {
        const finish = [];
        settings.forEach((data, i) => {
            finish.push(
                <Link
                    href={data.url}
                    key={i}
                    className={`flex items-center hover:bg-primary-20 rounded-xl px-[10px] py-[10px] font-semibold ${
                        data.color === "red"
                            ? "text-red-700 hover:text-red-700"
                            : "text-text hover:text-text"
                    }`}
                >
                    <div className="w-[30px]">{data.image}</div>
                    <div>{data.value}</div>
                </Link>
            );
        });
        return finish;
    };
    return (
        <>
            <Link
                href={`/me`}
                className={`flex items-center px-[10px] py-[10px] font-medium text-text hover:text-text gap-4 opacity-100`}
            >
                <div className="w-[40px]">
                    <Image
                        className="rounded-full"
                        src={user?.image}
                        width={40}
                        height={40}
                        alt={`profile picture ${user?.uniqueName}`}
                    />
                </div>
                <div>
                    @
                    {user?.uniqueName.length > 10
                        ? `${user?.uniqueName.slice(10)}...`
                        : user?.uniqueName}
                </div>
            </Link>
            <div className=" w-max">
                <LoadSettings />
            </div>
        </>
    );
}

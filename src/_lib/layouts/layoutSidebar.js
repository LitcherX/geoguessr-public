import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "@/_lib/components/settingsSidebar";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "@lib/css/global.css";

export default function LayoutSidebar({ children, data }) {
    const [menu, setMenu] = useState(false);

    return (
        <div className="w-full flex h-full items-start max-w-[100vw]">
            <div className=" w-max">
                <div className=" max-[600px]:absolute left-5 top-5">
                    <FontAwesomeIcon
                        icon={!menu ? faBars : faXmark}
                        onClick={() => {
                            setMenu((prev) => (prev === true ? false : true));
                        }}
                        className="max-[600px]:block hidden w-[20px] h-auto"
                    />
                    <div
                        className={`z-[100000] absolute w-screen h-screen transition-all ${
                            menu
                                ? "left-0 bg-background-60"
                                : "-left-[100vw] bg-opacity-0"
                        }`}
                    >
                        <div className="w-fit h-screen bg-background">
                            <Sidebar user={data.user} />
                        </div>
                    </div>
                </div>
                <div className=" max-[600px]:hidden pr-[5rem]">
                    <Sidebar user={data.user} />
                </div>
            </div>
            <div className=" w-full flex flex-col h-full gap-6 px-[20px]">
                {children}
            </div>
        </div>
    );
}

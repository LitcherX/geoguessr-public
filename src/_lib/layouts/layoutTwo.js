import Navbar from "@/_lib/components/navbar";
import React from "react";
import LayoutMain from "@/_lib/layouts/layoutMain";
import "@lib/css/global.css";

export default function LayoutTwo({ children }) {
    const [menu, setMenu] = React.useState(false);
    return (
        <LayoutMain>
            <div className="flex justify-center w-screen">
                <div className="flex flex-col min-h-screen w-[1100px] gap-[100px]">
                    <div>
                        <Navbar menu={menu} setMenu={setMenu} />
                    </div>
                    <main className={`mt-[50px] h-full ${menu ? "z-0" : ""}`}>
                        {children}
                    </main>
                </div>
            </div>
        </LayoutMain>
    );
}

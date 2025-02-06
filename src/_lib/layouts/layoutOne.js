import Navbar from "@/_lib/components/navbar";
import Footer from "@/_lib/components/footer";
import React from "react";
import LayoutMain from "@/_lib/layouts/layoutMain";
import "@lib/css/global.css";

export default function LayoutOne({ children, gameOn = false }) {
    const [menu, setMenu] = React.useState(false);

    return (
        <LayoutMain>
            <div className="flex justify-center w-screen">
                <div className="flex flex-col min-h-screen w-[1100px] gap-[100px]">
                    <div className={`z-50 ${gameOn ? "hidden" : ""}`}>
                        <Navbar menu={menu} setMenu={setMenu} />
                    </div>
                    <main
                        className={`${
                            gameOn ? "" : "mt-[50px]"
                        } h-full z-10 flex items-center justify-center`}
                    >
                        {children}
                    </main>
                    <footer className={`mt-auto ${gameOn ? "hidden" : ""}`}>
                        <Footer />
                    </footer>
                </div>
            </div>
        </LayoutMain>
    );
}

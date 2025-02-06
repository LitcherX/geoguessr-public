"use cliet";
import "@lib/css/global.css";
import React from "react";
import useThemeChange from "../functions/useThemeChange";
export default function LayoutMain({ children }) {
    useThemeChange();
    return (
        <div className=" bg-background min-h-screen min-w-screen h-auto text-text font-poppins">
            {children}
        </div>
    );
}

"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import React from "react";
export default function Navbar({ menu, setMenu }) {
    return (
        <div className={`fixed pt-[30px] w-[1100px] ${menu ? "z-[100]" : ""}`}>
            <div className="w-full flex items-center justify-center max-h-screen max-w-[100vw] px-[15px]">
                <div className=" min-[670px]:flex hidden max-w-[100vw] w-[1100px] py-[10px] h-[75px] px-[15px] items-center rounded-xl shadow-around shadow-text-20 bg-background-10 backdrop-blur-md">
                    <div className="w-1/4 flex items-center">
                        <p className="font-mono text-2xl font-black">
                            GeoGuessr ERLC
                        </p>
                    </div>
                    <div className="w-2/4 flex items-center justify-evenly">
                        <Link
                            href="/"
                            className=" transition-all duration-300 hover:font-bold hover:text-xl w-[130px] text-center text-text hover:text-text"
                        >
                            Home
                        </Link>
                        <Link
                            href="/play"
                            className=" bg-primary py-[5px] px-[15px] rounded-lg text-2xl font-bold hover:bg-opacity-85 hover:scale-125 transition-all duration-300 text-white hover:text-white hover:border-[#ffffff] hover:shadow-white shadow-around border-[2px]"
                        >
                            Play!
                        </Link>
                        <Link
                            href="/locations"
                            className=" transition-all duration-300 hover:font-bold hover:text-xl w-[130px] text-center text-text hover:text-text"
                        >
                            Locations
                        </Link>
                    </div>
                    <div className="w-1/4 flex justify-end">
                        <Link
                            href="/updates"
                            className="px-[10px] py-[5px] bg-primary rounded-lg font-bold animate-pulse hover:animate-none text-text hover:text-text hover:scale-110 transition-all duration-300"
                        >
                            NEW UPDATE!
                        </Link>
                    </div>
                </div>
                <div className=" min-[670px]:hidden max-w-[100vw] w-[1100px] flex py-[10px] h-[75px] px-[15px] rounded-xl shadow-around shadow-text-20 bg-background-10 backdrop-blur-md">
                    <div className="w-2/4 flex items-center">
                        <p className="font-mono text-2xl font-black">
                            GeoGuessr ERLC
                        </p>
                    </div>
                    <div className="w-2/4 flex items-center justify-end z-20">
                        <FontAwesomeIcon
                            icon={faBars}
                            className={`${
                                menu ? "hidden" : ""
                            } w-[25px] hover:cursor-pointer`}
                            onClick={() => {
                                setMenu(menu ? false : true);
                            }}
                        />
                    </div>
                </div>
            </div>
            <div
                className={` max-[670px]:flex hidden z-[1000] fixed top-0 transition-all gap-6 ${
                    menu ? "right-0" : "-right-[1000vw]"
                } flex-col justify-center items-center w-screen h-[100vh] bg-black bg-opacity-95`}
            >
                <div className="py-[68px] h-[75px] px-[30px] fixed w-full top-0 flex items-center justify-end z-[100]">
                    <FontAwesomeIcon
                        icon={faX}
                        className={`${
                            menu ? "text-white" : ""
                        } w-[25px] hover:cursor-pointer`}
                        onClick={() => {
                            setMenu(menu ? false : true);
                        }}
                    />
                </div>
                <Link
                    onClick={() => {
                        setMenu(false);
                    }}
                    href="/updates"
                    className="px-[10px] py-[5px] bg-primary rounded-lg font-bold animate-pulse text-white hover:text-white"
                >
                    NEW UPDATE!
                </Link>
                <Link
                    onClick={() => {
                        setMenu(false);
                    }}
                    href="/"
                    className=" text-xl font-bold text-white hover:bg-white hover:text-black rounded-lg py-[5px] px-[15px]"
                >
                    Home
                </Link>
                <Link
                    onClick={() => {
                        setMenu(false);
                    }}
                    href="/play"
                    className=" bg-primary py-[5px] px-[15px] rounded-lg text-2xl font-bold hover:bg-opacity-85 hover:scale-125 transition-all duration-300 text-white hover:border-[#ffffff] hover:shadow-white shadow-around border-[2px]"
                >
                    Play!
                </Link>
                <Link
                    onClick={() => {
                        setMenu(false);
                    }}
                    href="/locations"
                    className=" text-xl font-bold text-white hover:bg-white hover:text-black rounded-lg py-[5px] px-[15px]"
                >
                    Locations
                </Link>
            </div>
        </div>
    );
}

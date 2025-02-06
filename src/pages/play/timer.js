"use client";
import Image from "next/image";
import React from "react";
import * as fs from "node:fs";
import path from "path";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import random from "random";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import LayoutMain from "@/_lib/layouts/layoutMain";
import Navbar from "@/_lib/components/navbar";
import Footer from "@/_lib/components/footer";
import Head from "next/head";
import Map from "@/_lib/components/map";
import getFolders from "@/_lib/functions/getFolders";

export async function getServerSideProps() {
    const folders = await getFolders(fs, path);
    return {
        props: {
            folders,
        },
    };
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page({ folders }) {
    const [submit, setSubmit] = React.useState(true);
    const [zoom, setZoom] = React.useState(false);
    const [thinking, setThinking] = React.useState(false);
    const [data, setData] = React.useState({ x: null, y: null });
    const [distance, setDistance] = React.useState(0);
    const [int, setint] = React.useState(0);
    const myDivRef = React.useRef(null);
    const myDivRef2 = React.useRef(null);
    const outside = React.useRef(null);
    const outside2 = React.useRef(null);
    const [selected, setSelected] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);
    const [inputTime, setInputTime] = React.useState(null);
    const [remainingTime, setRemainingTime] = React.useState(false);
    const [countdown, setCountdown] = React.useState(null);
    const [stopDate, setStopDate] = React.useState(null);
    const [finished, setFinished] = React.useState(false);
    const [guesses, setGuesses] = React.useState([]);
    const [stopTimer, setStopTimer] = React.useState(false);
    const [dimensions, setDimensions] = React.useState({
        width: 0,
        height: 0,
        top: 0,
        left: 0,
    });
    const [startTime, setStartTime] = React.useState(new Date());
    const [time, setTime] = React.useState(null);
    const [coords, setCoords] = React.useState({
        x1: null,
        y1: null,
        x2: null,
        y2: null,
    });
    const [guess, setGuess] = React.useState(
        React.useMemo(() => Cookies.get("guess")?.split(",") || [], [])
    );
    if (guess[0] === "" || guess.length === 0) {
        Cookies.set("guess", folders);
        setGuess(folders);
    }
    const handleResize = () => {
        if (myDivRef.current) {
            setDimensions({
                width: myDivRef.current.offsetWidth,
                height: myDivRef.current.offsetHeight,
                top: myDivRef.current.offsetTop,
                left: myDivRef.current.offsetLeft,
            });
        }
    };
    const zoomToImage = () => {
        if (myDivRef2.current) {
            const { zoomToElement } = myDivRef2.current;
            zoomToElement("zoomTo");
        }
    };
    function handleClick(event) {
        if (outside.current && !outside.current.contains(event.target)) {
            setThinking(false);
        }
        if (outside2.current && !outside2.current.contains(event.target)) {
            setZoom(false);
        }
    }
    React.useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setZoom(false);
                setThinking(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    React.useEffect(() => {
        let i = random.int(0, guess.length - 1);
        setint(guess[i]);
    }, []);
    React.useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    React.useEffect(() => {
        if (int !== 0) {
            fetch(`/guess/${int}/data.json`)
                .then((response) => response.json())
                .then((data) => {
                    setData(data);
                    setSubmit(false);
                    setStopTimer(true);
                });
            handleResize();
            setStartTime(new Date());
            window.addEventListener("resize", handleResize);
            return () => {
                window.removeEventListener("resize", handleResize);
            };
        } else {
            let i = random.int(0, guess.length - 1);
            setint(guess[i]);
        }
    }, [int]);

    React.useEffect(() => {
        setGuesses((prev) => {
            if (time !== null) {
                return [
                    ...prev,
                    {
                        distance: distance,
                        time: time,
                        score: ((distance * time) / 10000).toFixed(2),
                    },
                ];
            } else {
                return prev;
            }
        });
    }, [distance]);

    React.useEffect(() => {
        const speedrunClock = setInterval(() => {
            if (countdown === 0 && stopDate !== null) {
                const nowDate = new Date() / 1000;
                if (!stopTimer) {
                    setStopDate(Number(stopDate) + 0.001);
                }
                if (stopDate >= nowDate && stopTimer) {
                    setRemainingTime(Number(stopDate - nowDate).toFixed(3));
                } else if (stopDate < nowDate) {
                    setRemainingTime(Number(0).toFixed(3));
                    setStopDate(null);
                    setCountdown(null);
                    setFinished(true);
                    let i = random.int(0, guess.length - 1);
                    setint(guess[i]);
                    setThinking(false);
                    setCoords({
                        x1: null,
                        y1: null,
                        x2: null,
                        y2: null,
                    });
                    setSelected(false);
                    setSubmit(true);
                    setStopTimer(false);
                    const { resetTransform } = myDivRef2.current;
                    resetTransform();
                    clearInterval(speedrunClock);
                    return;
                }
            }
        }, 1);

        const countdownTimer = setInterval(() => {
            if (!isNaN(countdown)) {
                if (countdown === 0) {
                    setStopDate(new Date() / 1000 + inputTime);
                    return;
                } else if (countdown !== null) {
                    setCountdown((prev) => prev - 1);
                }
            }
        }, 1000);

        return () => {
            clearInterval(speedrunClock);
            clearInterval(countdownTimer);
        };
    }, [countdown, remainingTime, stopDate, finished]);

    const PreloadImages = () => {
        const data = [];
        folders.map((int) => {
            data.push(
                <link
                    rel="preload"
                    href={`/guess/${int}/image.png`}
                    as="image"
                />
            );
        });
        return data;
    };
    return (
        <>
            <Head>
                <PreloadImages />
            </Head>
            <LayoutMain>
                <div className="flex justify-center w-screen px-[15px]">
                    <div className="flex flex-col min-h-screen w-[1100px] gap-[100px]">
                        <div>
                            <Navbar />
                        </div>
                        <main className="mt-[50px] h-full">
                            <div className="w-full flex justify-center h-full">
                                <div
                                    className={`${
                                        finished ? "" : "hidden"
                                    } flex gap-3 flex-col h-full justify-center items-center`}
                                >
                                    <h4>Congrats! Here are your stats:</h4>
                                    <div>
                                        <table className="table-auto w-[200px] max-w-full">
                                            <tbody>
                                                <tr>
                                                    <th className="text-left">
                                                        Time:
                                                    </th>
                                                    <th className="text-right font-normal">
                                                        {inputTime}s
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th className="text-left">
                                                        Guesses:
                                                    </th>
                                                    <th className="text-right font-normal">
                                                        {guesses.length}
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th className="text-left">
                                                        Score:
                                                    </th>
                                                    <th className="text-right font-normal">
                                                        {(isNaN(
                                                            guesses.reduce(
                                                                (
                                                                    accumulator,
                                                                    currentGuess
                                                                ) =>
                                                                    accumulator +
                                                                    Number(
                                                                        currentGuess.score
                                                                    ),
                                                                0
                                                            ) / guesses.length
                                                        )
                                                            ? 0
                                                            : guesses.reduce(
                                                                  (
                                                                      accumulator,
                                                                      currentGuess
                                                                  ) =>
                                                                      accumulator +
                                                                      Number(
                                                                          currentGuess.score
                                                                      ),
                                                                  0
                                                              ) / guesses.length
                                                        ).toFixed(3)}
                                                    </th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex w-full justify-center">
                                        <button
                                            onClick={(e) => {
                                                setGuesses([]);
                                                setFinished(false);
                                            }}
                                            className={`bg-primary px-[15px] py-[2px] rounded-full text-xl text-white`}
                                        >
                                            Play again
                                        </button>
                                    </div>
                                </div>
                                <div
                                    className={`${
                                        countdown >= 0 &&
                                        stopDate === null &&
                                        !finished
                                            ? ""
                                            : "hidden"
                                    } h-full flex items-center`}
                                >
                                    <h1 className="text-6xl animate-ping">
                                        {countdown}
                                    </h1>
                                </div>
                                <div
                                    className={`${
                                        countdown === null && !finished
                                            ? ""
                                            : "hidden"
                                    } flex flex-col items-center justify-center gap-3 h-full`}
                                >
                                    <h2>Choose a time</h2>
                                    <p>Time is in seconds</p>
                                    <div className="noapperance">
                                        <input
                                            type="number"
                                            name="time"
                                            id="time"
                                            placeholder={60}
                                            className=" bg-background rounded-full text-center w-[100px] text-xl"
                                            onInput={(e) => {
                                                setInputTime(
                                                    Number(e.target.value)
                                                );
                                            }}
                                        />
                                    </div>
                                    <button
                                        className={` bg-primary px-[15px] py-[2px] rounded-full text-xl text-white`}
                                        onClick={(e) => {
                                            setCountdown(5);
                                            setInputTime((prev) =>
                                                prev === null ? 60 : prev
                                            );
                                        }}
                                    >
                                        Start
                                    </button>
                                </div>
                                <div
                                    className={`${
                                        countdown === 0 &&
                                        stopDate !== null &&
                                        !finished
                                            ? ""
                                            : "hidden"
                                    }`}
                                >
                                    <div className="max-w-screen flex justify-center flex-col gap-4 items-center m-[5px]">
                                        <div className="w-auto max-w-full">
                                            <div
                                                onClick={() => {
                                                    setZoom(true);
                                                }}
                                            >
                                                <Image
                                                    src={`/guess/${int}/image.png`}
                                                    alt="guess it"
                                                    width={1919}
                                                    draggable={false}
                                                    height={580}
                                                    className={`rounded-xl max-h-[calc(100vh-250px)] w-auto h-[650px] ${
                                                        !int
                                                            ? " animate-pulse"
                                                            : ""
                                                    }`}
                                                />
                                            </div>
                                            <div
                                                onMouseDown={handleClick}
                                                className={`w-screen h-screen fixed top-0 left-0 flex flex-col justify-around items-center ${
                                                    zoom ? "" : "hidden"
                                                } bg-black bg-opacity-50`}
                                            >
                                                <div className="flex fixed top-0 justify-end w-full p-[15px] text-white">
                                                    <FontAwesomeIcon
                                                        icon={faX}
                                                    />
                                                </div>
                                                <div
                                                    ref={outside2}
                                                    className="w-auto h-auto px-[15px]"
                                                >
                                                    <TransformWrapper
                                                        className={` rounded-xl`}
                                                    >
                                                        <TransformComponent
                                                            className={` rounded-xl`}
                                                        >
                                                            <Image
                                                                src={`/guess/${int}/image.png`}
                                                                alt="guess it"
                                                                width={1919}
                                                                draggable={
                                                                    false
                                                                }
                                                                height={1000}
                                                                className={`rounded-xl w-auto max-h-[calc(100vh-80px)]`}
                                                            />
                                                        </TransformComponent>
                                                    </TransformWrapper>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setThinking(true);
                                                handleResize();
                                            }}
                                            className={`text-center w-fit px-[15px] py-[5px] text-2xl ${
                                                thinking ? "opacity-0" : ""
                                            } ${
                                                submit
                                                    ? "bg-primary-40"
                                                    : "bg-primary"
                                            } rounded-xl font-semibold text-white`}
                                            disabled={submit}
                                        >
                                            Guess
                                        </button>
                                        <div className="flex gap-3 items-center">
                                            <div>{remainingTime}</div>
                                            <button
                                                onClick={(e) => {
                                                    setStopDate(0);
                                                }}
                                                className="bg-secondary-40 py-[5px] px-[15px] rounded-full text-white"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                    <Map
                                        handleClick={handleClick}
                                        outside={outside}
                                        dimensions={dimensions}
                                        distance={distance}
                                        time={time}
                                        guess={guess}
                                        setint={setint}
                                        setThinking={setThinking}
                                        setCoords={setCoords}
                                        setSelected={setSelected}
                                        setSubmit={setSubmit}
                                        myDivRef2={myDivRef2}
                                        setGuess={setGuess}
                                        setDistance={setDistance}
                                        data={data}
                                        startTime={startTime}
                                        setIsDragging={setIsDragging}
                                        handleResize={handleResize}
                                        myDivRef={myDivRef}
                                        isDragging={isDragging}
                                        selected={selected}
                                        coords={coords}
                                        thinking={thinking}
                                        int={int}
                                        setTime={setTime}
                                        zoomToImage={zoomToImage}
                                    />
                                </div>
                            </div>
                        </main>
                        <footer
                            className={`mt-auto ${
                                countdown === 0 &&
                                stopDate !== null &&
                                !finished
                                    ? "hidden"
                                    : ""
                            }`}
                        >
                            <Footer />
                        </footer>
                    </div>
                </div>
            </LayoutMain>
        </>
    );
}

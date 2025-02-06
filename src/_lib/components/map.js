import Image from "next/image";
import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { convertToTargetPlane } from "@/_lib/math/geometry";
import map from "@public/maps/image.png";
import dark from "@public/maps/dark.png";
import random from "random";
import Cookies from "js-cookie";

export default function Map({
    handleClick,
    outside,
    dimensions,
    distance,
    time,
    guess,
    setint,
    setThinking,
    setCoords,
    setSelected,
    setSubmit,
    myDivRef2,
    setGuess,
    setDistance,
    data,
    startTime,
    setIsDragging,
    handleResize,
    myDivRef,
    isDragging,
    selected,
    coords,
    thinking,
    setTime,
    int,
    zoomToImage,
}) {
    return (
        <div
            onMouseDown={handleClick}
            className={` bg-black ${
                thinking ? "bg-opacity-50" : "opacity-0 pointer-events-none"
            } transition-all fixed w-screen h-screen top-0 left-0 flex flex-col gap-6 items-center justify-center p-[15px]`}
        >
            <div
                ref={outside}
                className={`w-auto h-auto max-h-[calc(100vh)] max-w-full overflow-hidden flex justify-center items-center`}
            >
                <div
                    className={`flex flex-col items-center gap-4 justify-between py-[30px] fixed max-h-full z-10 max-w-full text-center ${
                        selected ? "" : "hidden"
                    }`}
                    style={{
                        height: dimensions.height,
                        width: dimensions.width,
                    }}
                >
                    <div className="px-[15px] py-[10px] rounded-xl bg-background bg-opacity-35 border-text border-opacity-50 border-[2px]">
                        <p>Distance: {distance} studs</p>
                        <p>Time: {(time / 1000).toFixed(3)}s</p>
                        <p>Score: {((distance * time) / 10000).toFixed(2)}</p>
                    </div>
                    <button
                        id="next"
                        onClick={() => {
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
                            const { resetTransform } = myDivRef2.current;
                            resetTransform();
                        }}
                        className={`px-[20px] py-[7px] z-10 bg-primary rounded-xl text-white text-xl`}
                    >
                        Next Random
                    </button>
                </div>
                <div>
                    <TransformWrapper
                        ref={myDivRef2}
                        doubleClick={{ disabled: true }}
                        maxScale={20}
                        smooth={true}
                        wheel={{
                            step: 0.2,
                            smoothStep: 0.001,
                        }}
                        className={` max-h-[calc(100vh-100px)]`}
                    >
                        {() => {
                            const calculateDistance = (x, y) => {
                                if (guess[0] === "") {
                                    Cookies.set("guess", folders);
                                } else {
                                    let a = guess.filter((i) => i !== int);
                                    setGuess(a);
                                    Cookies.set("guess", a);
                                }
                                const tempScale = parseFloat(
                                    window
                                        .getComputedStyle(
                                            myDivRef2.current.instance
                                                .contentComponent
                                        )
                                        .transform.split(",")[0]
                                        .replace("matrix(", "")
                                );
                                const { x: convertedX, y: convertedY } =
                                    convertToTargetPlane(
                                        { x, y },
                                        {
                                            width: dimensions.width * tempScale,
                                            height:
                                                dimensions.height * tempScale,
                                        },
                                        { width: 3121, height: 3120 }
                                    );
                                setDistance(
                                    Math.sqrt(
                                        (convertedX - data.x) *
                                            (convertedX - data.x) +
                                            (convertedY - data.y) *
                                                (convertedY - data.y)
                                    ).toFixed(3)
                                );
                                setTime(new Date() - startTime);
                                setSelected(true);
                                let x1 = convertToTargetPlane(
                                    { x: data.x, y: data.y },
                                    { width: 3121, height: 3120 },
                                    {
                                        width: dimensions.width,
                                        height: dimensions.height,
                                    }
                                ).x;
                                let y1 = convertToTargetPlane(
                                    { x: data.x, y: data.y },
                                    { width: 3121, height: 3120 },
                                    {
                                        width: dimensions.width,
                                        height: dimensions.height,
                                    }
                                ).y;
                                let x2 = convertToTargetPlane(
                                    { x: convertedX, y: convertedY },
                                    { width: 3121, height: 3120 },
                                    {
                                        width: dimensions.width,
                                        height: dimensions.height,
                                    }
                                ).x;
                                let y2 = convertToTargetPlane(
                                    { x: convertedX, y: convertedY },
                                    { width: 3121, height: 3120 },
                                    {
                                        width: dimensions.width,
                                        height: dimensions.height,
                                    }
                                ).y;
                                setCoords({ x1, y1, x2, y2 });
                                setTimeout(() => {
                                    zoomToImage();
                                }, 100);
                            };
                            const capture = (e) => {
                                if (selected) return;
                                handleResize();
                                const rect =
                                    myDivRef.current.getBoundingClientRect();
                                calculateDistance(
                                    e.clientX - rect.left,
                                    e.clientY - rect.top
                                );
                            };
                            const handleEvent = (e) => {
                                if (e.type === "mousedown") {
                                    setIsDragging(false);
                                } else if (e.type === "mousemove") {
                                    setTimeout(() => setIsDragging(true), 10);
                                } else if (e.type === "mouseup") {
                                    setTimeout(() => setIsDragging(false), 1);
                                } else if (e.type === "click") {
                                    if (!isDragging && !selected) {
                                        capture(e);
                                    }
                                }
                            };
                            return (
                                <React.Fragment>
                                    <TransformComponent>
                                        <div
                                            onMouseDown={handleEvent}
                                            onMouseMove={handleEvent}
                                            onClick={handleEvent}
                                            onMouseUp={handleEvent}
                                            ref={myDivRef}
                                            className={`flex items-center justify-center`}
                                        >
                                            <svg
                                                width={dimensions.width}
                                                height={dimensions.height}
                                                xmlns="http://www.w3.org/2000/svg"
                                                version="1"
                                                className={`absolute z-[120] pointer-events-none ${
                                                    selected ? "" : "hidden"
                                                }`}
                                            >
                                                <defs>
                                                    <linearGradient
                                                        id="e"
                                                        x1={coords.x1}
                                                        y1={coords.y1}
                                                        x2={coords.x2}
                                                        y2={coords.y2}
                                                        gradientUnits="userSpaceOnUse"
                                                    >
                                                        <stop
                                                            stopColor="green"
                                                            offset="0"
                                                        />
                                                        <stop
                                                            stopColor={
                                                                distance > 1000
                                                                    ? "darkred"
                                                                    : distance >
                                                                      600
                                                                    ? "red"
                                                                    : distance >
                                                                      300
                                                                    ? "orange"
                                                                    : "lightgreen"
                                                            }
                                                            offset="1"
                                                        />
                                                    </linearGradient>
                                                </defs>
                                                <g
                                                    id={`zoomTo`}
                                                    className="min-w-[calc(100%+20px)] min-h-[calc(100%+20px)]"
                                                >
                                                    <circle
                                                        cx={coords.x2}
                                                        cy={coords.y2}
                                                        r="3"
                                                        fill={
                                                            distance > 1000
                                                                ? "darkred"
                                                                : distance > 600
                                                                ? "red"
                                                                : distance > 300
                                                                ? "orange"
                                                                : "lightgreen"
                                                        }
                                                    />
                                                    <circle
                                                        cx={coords.x1}
                                                        cy={coords.y1}
                                                        r="3"
                                                        fill="green"
                                                    />
                                                    <line
                                                        x1={
                                                            coords.x1 >
                                                            coords.x2
                                                                ? coords.x1 + 70
                                                                : coords.x1 - 70
                                                        }
                                                        y1={
                                                            coords.y1 >
                                                            coords.y2
                                                                ? coords.y1 + 70
                                                                : coords.y1 - 70
                                                        }
                                                        x2={
                                                            coords.x2 >
                                                            coords.x1
                                                                ? coords.x2 + 70
                                                                : coords.x2 - 70
                                                        }
                                                        y2={
                                                            coords.y2 >
                                                            coords.y1
                                                                ? coords.y2 + 70
                                                                : coords.y2 - 70
                                                        }
                                                        stroke="white"
                                                        strokeWidth="0"
                                                    />
                                                    <line
                                                        x1={coords.x1}
                                                        y1={coords.y1}
                                                        x2={coords.x2}
                                                        y2={coords.y2}
                                                        stroke="url(#e)"
                                                        strokeWidth="3"
                                                    />
                                                </g>
                                            </svg>
                                            <Image
                                                src={map}
                                                draggable={false}
                                                alt="map"
                                                objectFit="cover"
                                                className={`no-drag w-auto h-full max-h-[calc(100vh-100px)] z-[100] ${
                                                    selected ? "opacity-45" : ""
                                                }`}
                                            />
                                            <Image
                                                src={dark}
                                                draggable={false}
                                                alt="dark"
                                                objectFit="cover"
                                                className={`no-drag w-auto h-full max-h-[calc(100vh-100px)] z-[50] absolute`}
                                            />
                                        </div>
                                    </TransformComponent>
                                </React.Fragment>
                            );
                        }}
                    </TransformWrapper>
                </div>
            </div>
        </div>
    );
}

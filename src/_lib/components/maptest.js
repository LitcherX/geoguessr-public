import Image from "next/image";
import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import map from "@public/maps/image.png";
import dark from "@public/maps/dark.png";
import convertCoordinates from "../functions/coordinateConverter";
import { apiCall } from "./global";

function calculateDistance(cords1, cords2) {
    const { x1, y1 } = cords1;
    const { x2, y2 } = cords2;
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)).toFixed(3);
}

export default function Map({
    jsonData,
    setSolved,
    mapRef,
    onClickOutside,
    setOpenMap,
    setResults,
    user,
    guessButtonRef,
}) {
    const clickRef = React.useRef(null);
    const testRef = React.useRef(null);
    const imageRef = React.useRef(null);
    const [coords, setCoords] = React.useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
    const [distance, setDistance] = React.useState(null);
    const [zoom, setZoom] = React.useState(1);
    const [time, setTime] = React.useState(0);
    const [date, setDate] = React.useState(new Date());
    const [dimensions, setDimensions] = React.useState({});
    const handleZoom = () => {
        const { zoomToElement } = testRef.current;
        zoomToElement("zoomTo");
    };
    React.useEffect(() => {
        console.log(coords);
    }, [coords]);
    const dim = () => {
        if (
            clickRef?.current?.offsetWidth > 0 &&
            clickRef?.current &&
            clickRef?.current?.offsetWidth !== dimensions.w
        ) {
            setDimensions({
                w: clickRef.current.offsetWidth,
                h: clickRef.current.offsetHeight,
            });
        }
    };
    function handleCoords() {
        if (jsonData && coords && imageRef) {
            const { x: x2, y: y2 } = convertCoordinates(
                {
                    x: jsonData.coords.x,
                    y: jsonData.coords.y,
                },
                {
                    ow: imageRef.current.naturalWidth,
                    oh: imageRef.current.naturalHeight,
                },
                {
                    aw: imageRef.current.offsetWidth,
                    ah: imageRef.current.offsetHeight,
                }
            );
            console.log(
                jsonData.coords.x,
                jsonData.coords.y,
                imageRef.current.naturalWidth,
                imageRef.current.naturalHeight,
                imageRef.current.offsetWidth,
                imageRef.current.offsetHeight,
                imageRef
            );
            setCoords({
                x1: coords.x1,
                y1: coords.y1,
                x2: x2,
                y2: y2,
            });
        }
    }
    React.useEffect(() => {
        handleCoords();
    }, [imageRef, jsonData, mapRef]);
    React.useEffect(() => {
        dim();
    }, [clickRef]);
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (mapRef.current && !mapRef.current.contains(event.target)) {
                onClickOutside();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClickOutside]);
    return (
        <div className="h-full w-full flex justify-center items-center bg-black bg-opacity-50">
            <div ref={mapRef}>
                <div
                    className={`flex pointer-events-none flex-col items-center gap-4 justify-between p-[50px] fixed max-h-full z-10 max-w-full text-center w-screen h-screen left-0 top-0 ${
                        coords.x1 ? "" : "hidden"
                    }`}
                >
                    <div className="px-[15px] py-[10px] rounded-xl bg-background bg-opacity-35 border-text border-opacity-50 border-[2px]">
                        <p>Distance: {distance} studs</p>
                        <p>Time: {(time / 1000).toFixed(3)}s</p>
                        <p>Score: {((distance * time) / 10000).toFixed(2)}</p>
                    </div>
                    <button
                        id="next"
                        onClick={() => {
                            setCoords({});
                            setDistance(null);
                            setDate(new Date());
                            setSolved((prev) => {
                                return prev + 1;
                            });
                            const { resetTransform } = testRef.current;
                            resetTransform();
                            setOpenMap(false);
                            const score = ((distance * time) / 10000).toFixed(
                                2
                            );
                            apiCall("leaderboard", "POST", "asd", {
                                scoreAdd: score,
                            });

                            try {
                                setResults((prev) => {
                                    return [
                                        ...(prev || []),
                                        {
                                            time: time / 1000,
                                            distance: distance,
                                            score: score,
                                            user: user.user.id,
                                            name: user.user.name,
                                            avatarURL: user.user.image,
                                        },
                                    ];
                                });
                            } catch {
                                return;
                            }
                        }}
                        className={`px-[20px] py-[7px] absolute z-10 bg-primary rounded-xl text-white text-xl pointer-events-auto`}
                        style={{
                            top: guessButtonRef?.current?.offsetTop,
                        }}
                    >
                        Next Random
                    </button>
                </div>
                <TransformWrapper
                    doubleClick={{ disabled: true }}
                    maxScale={20}
                    smooth={true}
                    ref={testRef}
                    wheel={{
                        step: 0.2,
                        smoothStep: 0.001,
                    }}
                    onTransformed={(e) => {
                        setZoom(e.state.scale);
                        dim();
                    }}
                >
                    {() => {
                        var drag, selected;
                        const capture = (e) => {
                            if (coords.x1) return;
                            setTime((new Date() - date).toFixed(3));
                            const rect =
                                clickRef.current.getBoundingClientRect();
                            const data = jsonData.coords;
                            const { x, y } = convertCoordinates(
                                {
                                    x: e.clientX - rect.left,
                                    y: e.clientY - rect.top,
                                },
                                {
                                    ow: imageRef.current.width * zoom,
                                    oh: imageRef.current.height * zoom,
                                },
                                {
                                    aw: imageRef.current.naturalWidth,
                                    ah: imageRef.current.naturalHeight,
                                }
                            );
                            setDistance(
                                calculateDistance(
                                    {
                                        x1: data.x,
                                        y1: data.y,
                                    },
                                    {
                                        x2: x,
                                        y2: y,
                                    }
                                )
                            );
                            const { x: x1, y: y1 } = convertCoordinates(
                                {
                                    x: e.clientX - rect.left,
                                    y: e.clientY - rect.top,
                                },
                                {
                                    ow: imageRef.current.width * zoom,
                                    oh: imageRef.current.height * zoom,
                                },
                                {
                                    aw: imageRef.current.offsetWidth,
                                    ah: imageRef.current.offsetHeight,
                                }
                            );
                            setCoords({
                                x1: parseInt(x1),
                                y1: parseInt(y1),
                                x2: coords.x2,
                                y2: coords.y2,
                            });
                            setTimeout(() => {
                                handleZoom();
                            }, 100);
                        };
                        const handleEvent = (e) => {
                            if (e.type === "mousedown") {
                                drag = false;
                            } else if (e.type === "mousemove") {
                                setTimeout(() => (drag = true), 10);
                            } else if (e.type === "mouseup") {
                                setTimeout(() => (drag = false), 1);
                            } else if (e.type === "click") {
                                if (!drag && !selected) {
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
                                        ref={clickRef}
                                    >
                                        <svg
                                            width={dimensions.w}
                                            height={dimensions.h}
                                            xmlns="http://www.w3.org/2000/svg"
                                            version="1"
                                            className={`absolute z-[120] pointer-events-none ${
                                                coords.x1 ? "" : "hidden"
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
                                                                : distance > 600
                                                                ? "red"
                                                                : distance > 300
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
                                                    r="1.5"
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
                                                    r="1.5"
                                                    fill="green"
                                                />
                                                <line
                                                    x1={
                                                        coords.x1 > coords.x2
                                                            ? coords.x1 + 70
                                                            : coords.x1 - 70
                                                    }
                                                    y1={
                                                        coords.y1 > coords.y2
                                                            ? coords.y1 + 70
                                                            : coords.y1 - 70
                                                    }
                                                    x2={
                                                        coords.x2 > coords.x1
                                                            ? coords.x2 + 70
                                                            : coords.x2 - 70
                                                    }
                                                    y2={
                                                        coords.y2 > coords.y1
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
                                                <path
                                                    d="M16.65,1.3l-.94,0c-.32,0-.63,0-.94,0C4.34,1.9-2.12,13,2,22.61L14.6,52.15a1.2,1.2,0,0,0,2.21,0L29.43,22.61C33.53,13,27.07,1.9,16.65,1.3Zm-.8,25.33a10,10,0,1,1,10-10A10,10,0,0,1,15.85,26.63Z"
                                                    fill={
                                                        distance > 1000
                                                            ? "darkred"
                                                            : distance > 600
                                                            ? "red"
                                                            : distance > 300
                                                            ? "orange"
                                                            : "lightgreen"
                                                    }
                                                    transform={`translate(${
                                                        coords.x2 - 8
                                                    },${
                                                        coords.y2 - 26
                                                    }) scale(0.5)`}
                                                    stroke="white"
                                                    strokeWidth={2}
                                                />
                                                <path
                                                    d="M16.65,1.3l-.94,0c-.32,0-.63,0-.94,0C4.34,1.9-2.12,13,2,22.61L14.6,52.15a1.2,1.2,0,0,0,2.21,0L29.43,22.61C33.53,13,27.07,1.9,16.65,1.3Zm-.8,25.33a10,10,0,1,1,10-10A10,10,0,0,1,15.85,26.63Z"
                                                    fill="green"
                                                    transform={`translate(${
                                                        coords.x1 - 8
                                                    },${
                                                        coords.y1 - 26
                                                    }) scale(0.5)`}
                                                    stroke="white"
                                                    strokeWidth={2}
                                                />
                                            </g>
                                        </svg>
                                        <Image
                                            ref={imageRef}
                                            src={map}
                                            draggable={false}
                                            alt="map"
                                            objectFit="cover"
                                            onLoad={() => {
                                                handleCoords();
                                            }}
                                            className={`no-drag w-auto h-full max-h-[calc(100vh-100px)] z-[100]`}
                                        />
                                        <Image
                                            src={dark}
                                            draggable={false}
                                            alt="dark"
                                            objectFit="cover"
                                            className={`no-drag w-auto h-full max-h-[calc(100vh-100px)] z-[50] opacity-45 absolute hidden`}
                                        />
                                    </div>
                                </TransformComponent>
                            </React.Fragment>
                        );
                    }}
                </TransformWrapper>
            </div>
        </div>
    );
}

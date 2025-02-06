import Head from "next/head";
import Image from "next/image";
import React from "react";
import Map from "./maptest";
import { apiCall } from "@/_lib/components/global";

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default function Game({
    results,
    setResults,
    folders,
    stop,
    user,
    gameMode,
    multiplayer,
    setStopped,
    token,
    joinCode,
    lobby,
}) {
    const [solved, setSolved] = React.useState(0);
    const [order, setOrder] = React.useState([]);
    const [jsonData, setJsonData] = React.useState([]);
    const [openMap, setOpenMap] = React.useState(false);
    const mapRef = React.useRef(null);

    const guessButtonRef = React.useRef(null);

    const [revolutions, setRevolutions] = React.useState(0);
    React.useEffect(() => {
        if (solved === folders.length) {
            setRevolutions(revolutions + 1);
            setSolved(0);
            loadImages(shuffleArray(folders));
        }
    }, [solved, order]);
    React.useEffect(() => {
        const array = shuffleArray(folders);
        setOrder(array);
        loadImages(array);
    }, []);
    React.useEffect(() => {
        async function stop() {
            switch (gameMode) {
                case "timer": {
                    if (multiplayer) {
                        return;
                    }
                }
                case "postal": {
                    if (multiplayer) {
                        return;
                    }
                }
                default: {
                    if (multiplayer) {
                        if (solved >= 10) {
                            setStopped(true);
                            async function load() {
                                await apiCall("updateLobby", "POST", token, {
                                    joinCode: joinCode,
                                    results: results,
                                });
                            }
                            load();
                        }
                    } else {
                        return;
                    }
                }
            }
        }
        stop();
    }, [solved]);
    React.useEffect(() => {
        if (!multiplayer) return;
        let res = lobby.results
            .map((d) => JSON.parse(d))
            .filter((d) => d.user === user.user.id).length;
        if (res >= 10) {
            setStopped(true);
        }
    }, [lobby]);
    const loadImages = async (order) => {
        console.log("Loading images");
        const data = await apiCall(`getData`, `POST`, token, { order });
        data.map((d, i) => {
            data[i] = {
                coords: d,
                image: (
                    <Image
                        src={`/guess/${order[i]}/image.png`}
                        width={1919}
                        height={580}
                        alt="image"
                        draggable={false}
                        className="rounded-xl overflow-hidden w-auto h-auto max-h-[500px]"
                        style={{
                            backgroundPosition: "center",
                        }}
                    ></Image>
                ),
            };
        });
        setJsonData(data);
    };
    const PreloadImages = () => {
        const data = [];
        async function a() {
            data.push(
                <link rel="prefetch" href={`/maps/image.png`} as="image" />
            );
            data.push(
                <link rel="prefetch" href={`/maps/dark.png`} as="image" />
            );
            data.push(
                <link rel="prefetch" href={`/guess/0/image.png`} as="image" />
            );
            await folders.map((int) => {
                data.push(
                    <link
                        rel="prefetch"
                        href={`/guess/${int}/image.png`}
                        as="image"
                    />
                );
            });
        }
        a();
        return data;
    };
    const GuessObject = () => {
        switch (gameMode) {
            case "postal": {
                return (
                    <div
                        className={`w-full flex justify-center items-center mt-[15px]`}
                    >
                        <form
                            className="flex flex-col justify-center items-center gap-2"
                            onSubmit={(e) => {
                                e.target[0].readOnly = true;
                                e.preventDefault();
                                let code = parseInt(e.target[0].value);
                                if (
                                    jsonData[solved].coords.postal.indexOf(
                                        code
                                    ) >= 0
                                ) {
                                    setSolved((prev) => {
                                        return prev + 1;
                                    });
                                    e.target.children[1].classList.add(
                                        "hidden"
                                    );
                                } else {
                                    e.target.children[1].classList.remove(
                                        "hidden"
                                    );
                                }
                                e.target[0].readOnly = false;
                                e.target[0].value = "";
                                e.target[0].focus();
                            }}
                        >
                            <input
                                id="postal"
                                className="border-text bg-primary-40 text-center rounded-full w-[100px]"
                                autoFocus
                            ></input>
                            <label
                                for="postal"
                                className="hidden bg-secondary-30 rounded-full py-[5] px-[10px]"
                            >
                                Wrong code
                            </label>
                        </form>
                    </div>
                );
            }
            default: {
                return (
                    <>
                        <div className="w-full flex justify-center items-center mt-[15px] z-10">
                            <button
                                onClick={(e) => {
                                    setOpenMap(true);
                                }}
                                ref={guessButtonRef}
                                className="px-[20px] py-[7px] z-10 bg-primary rounded-xl text-white text-xl"
                            >
                                Guess
                            </button>
                        </div>
                        <div
                            className={`fixed top-0 left-0 w-full h-full z-20 ${
                                openMap ? "" : "hidden"
                            }`}
                        >
                            <Map
                                jsonData={jsonData[solved]}
                                setSolved={setSolved}
                                solved={solved}
                                mapRef={mapRef}
                                setOpenMap={setOpenMap}
                                setResults={setResults}
                                onClickOutside={() => setOpenMap(false)}
                                user={user}
                                guessButtonRef={guessButtonRef}
                            />
                        </div>
                    </>
                );
            }
        }
    };
    return (
        <>
            <Head>
                <PreloadImages />
            </Head>
            <div className="flex flex-col max-w-screen">
                <div className="flex justify-center items-center">
                    {jsonData?.length === folders.length ? (
                        jsonData.map((value, index) => (
                            <div
                                key={index}
                                style={{
                                    position:
                                        solved === index
                                            ? "relative"
                                            : "absolute",
                                    opacity: solved === index ? "1" : "0",
                                    zIndex: solved === index ? "10" : "0",
                                    pointerEvents:
                                        solved === index ? "auto" : "none",
                                    maxWidth: "100vw",
                                    width: "1080px",
                                    height: "auto",
                                }}
                                className="w-full flex justify-center px-4"
                            >
                                {value.image}
                            </div>
                        ))
                    ) : (
                        <div
                            style={{
                                position: "relative",
                                opacity: "1",
                                zIndex: "10",
                                pointerEvents: "none",
                                maxWidth: "100vw",
                                width: "1080px",
                                height: "auto",
                            }}
                            className="w-full flex justify-center px-4"
                        >
                            <Image
                                src={`/guess/${0}/image.png`}
                                width={1919}
                                height={580}
                                alt="image"
                                draggable={false}
                                className="rounded-xl overflow-hidden w-auto h-auto max-h-[500px]"
                                style={{
                                    backgroundPosition: "center",
                                }}
                            ></Image>
                        </div>
                    )}
                </div>
                <GuessObject />
            </div>
        </>
    );
}

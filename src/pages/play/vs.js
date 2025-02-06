import LayoutOne from "@/_lib/layouts/layoutOne";
import React from "react";
import { signIn } from "next-auth/react";
import { auth } from "@/app/auth";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { generateToken } from "@/_utils/jwt";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { debounce } from "lodash";
import LoadingDots from "@/_lib/components/loadingDots";
import * as fs from "node:fs";
import path from "path";
import { apiCall } from "@/_lib/components/global";
import Game from "@/_lib/components/game";
import getFolders from "@/_lib/functions/getFolders";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page({
    auth,
    token,
    supabaseUrl,
    supabaseKey,
    folders,
}) {
    const [user, setUser] = React.useState(auth);
    const [underCreation, setUnderCreation] = React.useState(false);
    const [underJoin, setUnderJoin] = React.useState(false);
    const [joinCode, setJoinCode] = React.useState("");
    const [customValue, setCustomValue] = React.useState(2);
    const [lobby, setLobby] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [copyText, setCopyText] = React.useState("Click to copy the code");
    const [participants, setParticipants] = React.useState([]);
    const [client, setClient] = React.useState(null);
    const [results, setResults] = React.useState([]);
    const [gameMode, setGameMode] = React.useState("casual");
    const [stopped, setStopped] = React.useState(false);
    const button = `bg-primary py-[5px] px-[20px] text-white font-xl rounded-full`;
    const buttonSec = `bg-secondary py-[5px] px-[20px] text-white font-xl rounded-full`;
    React.useEffect(() => {
        setClient(createClient(supabaseUrl, supabaseKey));
        const getPrev = async () => {
            let data = await apiCall("getLobby", "POST", token);
            if (data.status === 200) {
                setLobby(data.lobby);
                setJoinCode(data.lobby.joinCode);
                if (data.owner) {
                    setUnderCreation(true);
                } else {
                    setUnderJoin(true);
                }
            }
        };
        getPrev();
    }, []);
    React.useEffect(() => {
        client
            ?.channel("schema-db-changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "Lobby",
                },
                (payload) => {
                    const data = payload.new;
                    if (data.id === user.user.lobbyId) {
                        setLobby(data);
                    }
                    const check = payload.old;
                    if (
                        check.id === user.user.lobbyId &&
                        Object.keys(data).length === 0
                    ) {
                        leaveLobby();
                    }
                }
            )
            .subscribe();
    }, [joinCode, user]);
    React.useEffect(() => {
        async function load() {
            if (underCreation && user.user.lobbyId === null) {
                let data = await apiCall("createLobby", "POST", token);
                if (data.status !== 200) {
                    setError(data.error);
                } else {
                    setJoinCode(data.lobby.joinCode);
                    setLobby(data.lobby);
                    const newUser = user;
                    newUser.user.lobbyId = data.lobby.id;
                    setUser(newUser);
                }
            }
        }
        load();
    }, [underCreation]);

    const leaveLobby = async (deleteValues = true) => {
        if (deleteValues) {
            setUnderCreation(false);
            setUnderJoin(false);
            setJoinCode(null);
            setCustomValue(2);
            setParticipants(undefined);
            setLobby(null);
            setError(null);
        }
        await apiCall("leaveLobby", "POST", token);
        const updatedUser = { ...user };
        updatedUser.user.lobbyId = null;
        setUser(updatedUser);
    };
    const cancel = () => {
        const deleteEntry = async () => {
            await apiCall("deleteLobby", "POST", token);
            await leaveLobby();
        };
        deleteEntry();
    };
    const handleJoin = () => {
        if (!joinCode) return;
        const joinLobby = async () => {
            setError(null);
            await leaveLobby(false);
            let data = await apiCall("joinLobby", "POST", token, {
                joinCode,
            });
            if (data.status !== 200) {
                setJoinCode("");
                setError(data.error);
            } else {
                setLobby(data.lobby);
                const newUser = user;
                newUser.user.lobbyId = data.lobby.id;
                setUser(newUser);
            }
        };
        joinLobby();
    };
    React.useEffect(() => {
        setCustomValue(lobby?.count);
        setParticipants(
            lobby?.players.map((data) =>
                typeof data === "string" ? JSON.parse(data) : data
            )
        );
        if (lobby?.ended) {
            setResults([]);
        }
        if (!lobby?.ended && !lobby?.started && lobby?.results.length === 0) {
            async function func() {
                await apiCall("updateLobby", "POST", token, {
                    joinCode: joinCode,
                });
            }
        }
        if (lobby?.results?.length === 0) {
            setStopped(false);
        }
    }, [lobby]);
    const load = debounce(async (count, started) => {
        let data = await apiCall("updateLobby", "POST", token, {
            count: count,
            started: started,
            joinCode: joinCode,
        });
        if (data.status !== 200) {
            setError(data.error);
        } else {
            setLobby(data.lobby);
            setUnderCreation(true);
        }
    }, 500);
    const ShowResults = () => {
        const data = lobby.results.map((d) => ({
            ...JSON.parse(d),
            distance: parseFloat(JSON.parse(d).distance),
            time: parseFloat(JSON.parse(d).time),
            score: parseFloat(JSON.parse(d).score),
        }));
        const groupedAndAveraged = data.reduce((acc, curr) => {
            if (!acc[curr.user]) {
                acc[curr.user] = {
                    distance: 0,
                    time: 0,
                    score: 0,
                    count: 0,
                    avatarURL: "",
                    name: "",
                };
            }

            acc[curr.user].distance += curr.distance;
            acc[curr.user].time += curr.time;
            acc[curr.user].score += curr.score;
            acc[curr.user].count++;
            acc[curr.user].avatarURL = curr.avatarURL;
            acc[curr.user].name = curr.name;

            return acc;
        }, {});
        const averagedEntries = Object.entries(groupedAndAveraged).map(
            ([user, stats]) => ({
                user: user,
                distance: (stats.distance / stats.count).toFixed(3),
                time: (stats.time / stats.count).toFixed(3),
                score: (stats.score / stats.count).toFixed(2),
                avatarURL: stats.avatarURL,
                name: stats.name,
            })
        );
        const sortedEntries = averagedEntries.sort((a, b) => a.score - b.score);
        return (
            <table className=" border-spacing-x-[30px] border-spacing-y-2 border-separate">
                <thead>
                    <tr className=" border-b-text-20 border-b-2">
                        <th>User</th>
                        <th>Score</th>
                        <th>Distance</th>
                        <th>Time</th>
                        <th>Place</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedEntries.map((entry, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td className="flex justify-center flex-col items-center">
                                    <Image
                                        src={entry.avatarURL}
                                        width={60}
                                        height={60}
                                        className="rounded-full"
                                    />
                                    {entry.name}
                                </td>
                                <td>{entry.score}</td>
                                <td>{entry.distance} px</td>
                                <td>{entry.time} s</td>
                                <td
                                    className={`${
                                        index + 1 === 1
                                            ? " text-gold"
                                            : index + 1 === 2
                                            ? " text-silver"
                                            : index + 1 === 3
                                            ? " text-bronze"
                                            : ""
                                    }`}
                                >
                                    #{index + 1}
                                </td>
                            </tr>
                            {index !== sortedEntries.length - 1 && (
                                <tr className="w-full">
                                    <td colSpan={5}>
                                        <hr className="border-[1px] h-[1px] border-text-20 w-full" />
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        );
    };
    return (
        <LayoutOne gameOn={lobby && lobby?.started && !stopped}>
            {user ? (
                lobby && lobby?.started && !stopped ? (
                    <div className="max-w-full">
                        <Game
                            folders={folders}
                            results={results}
                            setResults={setResults}
                            user={user}
                            gameMode={gameMode}
                            multiplayer={true}
                            setStopped={setStopped}
                            token={token}
                            joinCode={joinCode}
                            lobby={lobby}
                        />
                    </div>
                ) : (lobby && lobby?.ended) || stopped ? (
                    <div className="max-w-full flex flex-col items-center">
                        <ShowResults />
                        <button
                            onClick={(e) => {
                                async function load() {
                                    await apiCall(
                                        "updateLobby",
                                        "POST",
                                        token,
                                        {
                                            started: false,
                                            ended: false,
                                            joinCode: joinCode,
                                            results: [],
                                        }
                                    );
                                }
                                load();
                                let a = lobby;
                                a.started = false;
                                a.ended = false;
                                a.results = [];
                                setLobby(a);
                                setStopped(false);
                            }}
                            className={`${button} w-fit ${
                                lobby.ownerId === user.user.id ? "" : "hidden"
                            }`}
                        >
                            Back to Lobby
                        </button>
                    </div>
                ) : underCreation ? (
                    joinCode ? (
                        <div className="flex flex-col gap-3 h-full">
                            <>
                                <div className="noapperance flex justify-center items-center gap-2">
                                    <input
                                        type="number"
                                        name="time"
                                        id="time"
                                        placeholder={10}
                                        value={customValue}
                                        defaultValue={customValue}
                                        max={99}
                                        min={2}
                                        onChange={(e) => {
                                            e.target.value > 99
                                                ? setCustomValue(99)
                                                : e.target.value < 2
                                                ? setCustomValue(7)
                                                : setCustomValue(
                                                      e.target.value
                                                  );
                                        }}
                                        className=" bg-background rounded-full text-center w-[35px] text-xl"
                                    />
                                    <p className="font-bold">Players</p>
                                </div>
                            </>
                            <div className="flex justify-center">
                                <button
                                    data-tooltip-id="copy-tooltip"
                                    data-tooltip-content={copyText}
                                    onMouseLeave={(e) => {
                                        setTimeout(() => {
                                            setCopyText(
                                                "Click to copy the code"
                                            );
                                        }, 500);
                                    }}
                                    onClick={async (e) => {
                                        try {
                                            await navigator.clipboard.writeText(
                                                joinCode
                                            );
                                            setCopyText("Copied!");
                                            setTimeout(() => {
                                                setCopyText(
                                                    "Click to copy the code"
                                                );
                                            }, 2000);
                                        } catch (err) {
                                            console.error(
                                                "Failed to copy text: ",
                                                err
                                            );
                                        }
                                    }}
                                >
                                    <h3>{joinCode}</h3>
                                </button>
                                <ReactTooltip
                                    id="copy-tooltip"
                                    place="top"
                                    type="dark"
                                    effect="solid"
                                />
                            </div>

                            <h4
                                className={`text-center ${
                                    participants?.length > 0 ? "" : "hidden"
                                }`}
                            >
                                Players {participants?.length}/{customValue}:
                            </h4>
                            <div className="flex flex-col items-center h-full">
                                <div className="flex flex-wrap justify-center">
                                    {participants?.map((data) => (
                                        <div
                                            key={data.id}
                                            className="flex flex-col gap-3 rounded-lg p-[10px]"
                                        >
                                            <Image
                                                data-tooltip-id={data.id}
                                                data-tooltip-content={data.name}
                                                src={data.image}
                                                priority
                                                alt="Image"
                                                width={80}
                                                height={80}
                                                className="rounded-full"
                                            />
                                            <ReactTooltip
                                                id={data.id}
                                                place="top"
                                                type="dark"
                                                effect="solid"
                                            />
                                        </div>
                                    ))}
                                </div>
                                {participants?.length < lobby.count ||
                                participants?.length < customValue ? (
                                    <div
                                        key="waiting"
                                        className="flex items-center mt-auto gap-2 py-[20px]"
                                    >
                                        <h6>Waiting for others to join</h6>
                                        <LoadingDots size={8} />
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="flex flex-col gap-3 items-center mt-auto">
                                <div className="flex gap-3 justify-center">
                                    <button
                                        className={`${button} ${
                                            participants?.length !== customValue
                                                ? "bg-primary-40"
                                                : ""
                                        }`}
                                        disabled={
                                            participants?.length === customValue
                                                ? false
                                                : true
                                        }
                                        onClick={() => {
                                            load(customValue, true);
                                        }}
                                    >
                                        Start Lobby
                                    </button>
                                    <button
                                        className={`${buttonSec}`}
                                        onClick={cancel}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <button
                                    className={`${button} ${
                                        lobby.count === customValue
                                            ? "bg-primary-40"
                                            : ""
                                    }`}
                                    disabled={lobby.count === customValue}
                                    onClick={(e) => {
                                        setLobby(null);
                                        setUnderCreation(false);
                                        load(customValue);
                                    }}
                                >
                                    Save changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <LoadingDots size={32} />
                    )
                ) : underJoin ? (
                    joinCode && lobby ? (
                        <div className="h-full flex flex-col justify-center">
                            <button
                                data-tooltip-id="copy-tooltip"
                                data-tooltip-content={copyText}
                                onMouseLeave={(e) => {
                                    setTimeout(() => {
                                        setCopyText("Click to copy the code");
                                    }, 500);
                                }}
                                onClick={async (e) => {
                                    try {
                                        await navigator.clipboard.writeText(
                                            joinCode
                                        );
                                        setCopyText("Copied!");
                                        setTimeout(() => {
                                            setCopyText(
                                                "Click to copy the code"
                                            );
                                        }, 2000);
                                    } catch (err) {
                                        console.error(
                                            "Failed to copy text: ",
                                            err
                                        );
                                    }
                                }}
                            >
                                <h3>{joinCode}</h3>
                            </button>
                            <ReactTooltip
                                id="copy-tooltip"
                                place="top"
                                type="dark"
                                effect="solid"
                            />
                            <h4 className="text-center">
                                Players {participants?.length}/{lobby?.count}:
                            </h4>
                            <div className="flex flex-col items-center h-full">
                                <div className="flex flex-wrap justify-center">
                                    {participants?.map((data) => (
                                        <div
                                            key={data.id}
                                            className="flex flex-col gap-3 rounded-lg p-[10px]"
                                        >
                                            <Image
                                                data-tooltip-id={data.id}
                                                data-tooltip-content={data.name}
                                                src={data.image}
                                                priority
                                                alt="Image"
                                                width={80}
                                                height={80}
                                                className="rounded-full"
                                            />
                                            <ReactTooltip
                                                id={data.id}
                                                place="top"
                                                type="dark"
                                                effect="solid"
                                            />
                                        </div>
                                    ))}
                                </div>
                                {participants?.length < lobby.count ||
                                participants?.length < customValue ? (
                                    <div
                                        key="waiting"
                                        className="flex items-center mt-auto gap-2 py-[20px]"
                                    >
                                        <h6>Waiting for others to join</h6>
                                        <LoadingDots size={8} />
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="flex justify-center">
                                <button
                                    className={`${buttonSec} mt-auto w-fit`}
                                    onClick={leaveLobby}
                                >
                                    Leave
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="noapperance flex justify-center items-center gap-2">
                                Join Code:
                                <input
                                    type="number"
                                    name="time"
                                    id="time"
                                    placeholder="9999"
                                    max={9999}
                                    value={joinCode}
                                    onChange={(e) => {
                                        e.target.value > 9999
                                            ? null
                                            : setJoinCode(e.target.value);
                                        setError(null);
                                    }}
                                    className=" bg-background rounded-full text-center w-[60px] text-xl"
                                />
                            </div>
                            <p className=" text-red-700 dark:text-red-500 font-bold">
                                {error}
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    className={`${button} ${
                                        (error === null && joinCode >= 1000) ||
                                        joinCode >= 1000
                                            ? ""
                                            : "!bg-primary-40"
                                    }`}
                                    onClick={handleJoin}
                                    disabled={
                                        joinCode >= 1000 || error !== null
                                            ? false
                                            : true
                                    }
                                >
                                    Join Lobby
                                </button>
                                <button
                                    className={`${buttonSec}`}
                                    onClick={cancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )
                ) : user.user.lobbyId ? (
                    <LoadingDots size={32} />
                ) : (
                    <div className="flex items-center gap-4 justify-center h-full w-full flex-col">
                        <button
                            className={`${button}`}
                            onClick={() => setUnderCreation(true)}
                        >
                            Create Lobby
                        </button>
                        <button
                            className={`${button}`}
                            onClick={() => setUnderJoin(true)}
                        >
                            Join Lobby
                        </button>
                    </div>
                )
            ) : (
                <div className="flex items-center justify-center h-full w-full flex-col">
                    <h3>Not signed in</h3>
                    <button onClick={() => signIn()} className={button}>
                        Sign in
                    </button>
                </div>
            )}
        </LayoutOne>
    );
}

export async function getServerSideProps(ctx) {
    const session = await auth(ctx);
    const token = generateToken(session?.user.id);
    const folders = await getFolders(fs, path);
    return {
        props: {
            auth: session,
            token,
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseKey: process.env.SUPABASE_ANON_KEY,
            folders,
        },
    };
}

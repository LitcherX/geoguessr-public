import LayoutOne from "@lib/layouts/layoutOne";
import Image from "next/image";
import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import map from "@public/maps/image.png";
import convertCoordinates from "@lib/functions/coordinateConverter";
import { signIn } from "next-auth/react";
import { auth } from "@/app/auth";
import { generateToken } from "@/_utils/jwt";
import { ToastContainer, toast } from "react-toastify";
import useDarkMode from "@/_lib/functions/useDarkmode";
import { upload } from "@vercel/blob/client";

export async function getServerSideProps(ctx) {
    const session = await auth(ctx);
    const token = generateToken(session?.user.id);
    return {
        props: {
            auth: session,
            token,
        },
    };
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page({ auth, token }) {
    const [coords, setCoords] = React.useState({});
    const [zoom, setZoom] = React.useState(1);
    const [file, setFile] = React.useState(null);
    const [fileEnter, setFileEnter] = React.useState(false);
    const clickRef = React.useRef(null);
    const imageRef = React.useRef(null);
    const [dimensions, setDimensions] = React.useState({});

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

    async function handleSubmit(e) {
        e.preventDefault();
        if (!file || !coords.x || !coords.y) {
            return alert("Please choose a location and file");
        }
        const formData2 = new FormData();
        formData2.append("verify", token);
        const check = await fetch(`/api/checkBanned`, {
            method: "POST",
            body: formData2,
        });
        if (check.satus === 200) {
            return alert("You are not allowed to do this!");
        } else {
            const id = toast.loading("Please wait...", {
                autoClose: false,
                position: "bottom-right",
            });
            const res = await fetch(file);
            const blob = await res.blob();
            const fileObj = new File([blob], "image.jpg", { type: blob.type });
            const formData = new FormData();
            const newBlob = await upload(fileObj.name, fileObj, {
                access: "public",
                handleUploadUrl: "/api/createBlob",
            });
            formData.append(
                "message",
                `\`\`\`{x:${Math.floor(coords.x)}, y:${Math.floor(
                    coords.y
                )}}\`\`\``
            );
            formData.append("verify", token);
            formData.append("url", newBlob.url);
            await fetch(`/api/submitLocation`, {
                method: "POST",
                body: formData,
            }).then((res) => {
                if (res.status !== 200) {
                    toast.update(id, {
                        render: "Internal error",
                        type: "error",
                        autoClose: 2000,
                        closeOnClick: true,
                        isLoading: false,
                    });
                }
                toast.update(id, {
                    render: "Submission sent!",
                    type: "success",
                    autoClose: 2000,
                    closeOnClick: true,
                    isLoading: false,
                });
            });
        }
    }

    return (
        <div className="w-full flex h-full items-center justify-center flex-col gap-[20px] px-[15px]">
            <ToastContainer theme="colored" />
            {auth ? (
                auth.banned ? (
                    <h1>You are prohibited from using this function!</h1>
                ) : (
                    <>
                        <div className="flex flex-col justify-center items-center">
                            <h1>Location Submission</h1>
                        </div>
                        <div>
                            <TransformWrapper
                                doubleClick={{ disabled: true }}
                                maxScale={20}
                                smooth={true}
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
                                        const rect =
                                            clickRef.current.getBoundingClientRect();
                                        const { x, y } = convertCoordinates(
                                            {
                                                x: e.clientX - rect.left,
                                                y: e.clientY - rect.top,
                                            },
                                            {
                                                ow:
                                                    imageRef.current.width *
                                                    zoom,
                                                oh:
                                                    imageRef.current.height *
                                                    zoom,
                                            },
                                            {
                                                aw: imageRef.current
                                                    .naturalWidth,
                                                ah: imageRef.current
                                                    .naturalHeight,
                                            }
                                        );
                                        const { x: x1, y: y1 } =
                                            convertCoordinates(
                                                {
                                                    x: e.clientX - rect.left,
                                                    y: e.clientY - rect.top,
                                                },
                                                {
                                                    ow:
                                                        imageRef.current.width *
                                                        zoom,
                                                    oh:
                                                        imageRef.current
                                                            .height * zoom,
                                                },
                                                {
                                                    aw: imageRef.current
                                                        .offsetWidth,
                                                    ah: imageRef.current
                                                        .offsetHeight,
                                                }
                                            );
                                        setCoords({
                                            x,
                                            y,
                                            x1,
                                            y1,
                                        });
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
                                                            coords.x1
                                                                ? ""
                                                                : "hidden"
                                                        }`}
                                                    >
                                                        <path
                                                            d="M16.65,1.3l-.94,0c-.32,0-.63,0-.94,0C4.34,1.9-2.12,13,2,22.61L14.6,52.15a1.2,1.2,0,0,0,2.21,0L29.43,22.61C33.53,13,27.07,1.9,16.65,1.3Zm-.8,25.33a10,10,0,1,1,10-10A10,10,0,0,1,15.85,26.63Z"
                                                            fill="white"
                                                            transform={`translate(${
                                                                coords.x1 - 4.7
                                                            },${
                                                                coords.y1 - 16
                                                            }) scale(0.3)`}
                                                            stroke="black"
                                                            strokeWidth={2}
                                                        />
                                                    </svg>
                                                    <Image
                                                        ref={imageRef}
                                                        src={map}
                                                        draggable={false}
                                                        alt="map"
                                                        objectFit="cover"
                                                        className={`no-drag w-auto h-full max-h-[calc(100vh-100px)] z-[100]`}
                                                    />
                                                </div>
                                            </TransformComponent>
                                        </React.Fragment>
                                    );
                                }}
                            </TransformWrapper>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col justify-center items-center w-full"
                        >
                            <div className="container px-4 max-w-5xl mx-auto">
                                {!file ? (
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setFileEnter(true);
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            setFileEnter(false);
                                        }}
                                        onDragEnd={(e) => {
                                            e.preventDefault();
                                            setFileEnter(false);
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setFileEnter(false);
                                            if (e.dataTransfer.items) {
                                                [
                                                    ...e.dataTransfer.items,
                                                ].forEach((item, i) => {
                                                    if (item.kind === "file") {
                                                        const file =
                                                            item.getAsFile();
                                                        if (file) {
                                                            let blobUrl =
                                                                URL.createObjectURL(
                                                                    file
                                                                );
                                                            setFile(blobUrl);
                                                        }
                                                    }
                                                });
                                            } else {
                                                [
                                                    ...e.dataTransfer.files,
                                                ].forEach((file, i) => {});
                                            }
                                        }}
                                        className={`${
                                            fileEnter ? "border-4" : "border-2"
                                        } mx-auto bg-secondary-20 rounded-2xl flex flex-col w-full max-w-xs h-[200px] border-dashed items-center justify-center`}
                                    >
                                        <label
                                            htmlFor="file"
                                            className="h-full flex flex-col justify-center text-center"
                                        >
                                            <svg
                                                viewBox="0 0 640 512"
                                                height="50px"
                                            >
                                                <path
                                                    d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                                                    className=" fill-text"
                                                ></path>
                                            </svg>
                                            <div className=" mt-[20px] flex flex-col gap-[2px]">
                                                <p>Drag and drop</p>
                                                <div className="flex flex-row w-full justify-evenly items-center gap-[3px]">
                                                    <hr className=" w-[20px]" />
                                                    <p>or</p>
                                                    <hr className=" w-[20px]" />
                                                </div>
                                                <p className="bg-primary px-[8px] py-[3px] rounded-full hover:bg-primary-70 hover:cursor-pointer">
                                                    Click to upload
                                                </p>
                                            </div>
                                        </label>
                                        <input
                                            id="file"
                                            type="file"
                                            className="hidden"
                                            accept="images/*"
                                            onChange={(e) => {
                                                let files = e.target.files;
                                                if (files && files[0]) {
                                                    let blobUrl =
                                                        URL.createObjectURL(
                                                            files[0]
                                                        );
                                                    setFile(blobUrl);
                                                }
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <object
                                            className="rounded-md w-full max-w-xs h-[200px]"
                                            data={file}
                                            type="image/png"
                                        />
                                        <button
                                            onClick={() => setFile("")}
                                            className="px-4 mt-10 uppercase py-2 tracking-widest outline-none bg-red-600 rounded"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="mt-[30px] text-xl px-[20px] py-[5px] bg-primary rounded-xl hover:bg-primary-70"
                                disabled={!file || !coords.x || !coords.y}
                            >
                                Send Submission
                            </button>
                        </form>
                    </>
                )
            ) : (
                <div className="flex items-center justify-center h-full w-full flex-col">
                    <h3>Not signed in</h3>
                    <button
                        onClick={() => signIn()}
                        className={`bg-primary py-[5px] px-[20px] text-white font-xl rounded-full`}
                    >
                        Sign in
                    </button>
                </div>
            )}
        </div>
    );
}

Page.getLayout = function getLayout(page) {
    return <LayoutOne>{page}</LayoutOne>;
};

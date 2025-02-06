import LayoutOne from "@/_lib/layouts/layoutOne";
import Image from "next/image";
import Link from "next/link";
import casual from "@public/images/casual.png";
import vs from "@public/images/vs.png";
import timer from "@public/images/timer.png";
import postal from "@public/images/postal.png";
const modes = [
    {
        name: "casual",
        image: casual,
        route: "play/casual",
        description:
            "Play a casual game, good for practicing or just to pass time when you are alone or with friends.",
    },
    {
        name: "timer",
        image: timer,
        route: "play/timer",
        description:
            "A timed race for those who lack adrenaline and want to show off their skill.",
    },
    {
        name: "Multi",
        image: vs,
        route: "play/vs",
        description:
            "Multiplayer, a great game to decide who is the superior in ERLC GeoGuesser, live.",
    },
    {
        name: "Postal",
        image: postal,
        route: "play/postal",
        description:
            "Postal, is a gamemode, where you get an image and have to guess the postal code.",
    },
];

export default function Page() {
    const LoadModes = () => {
        const finish = [];
        modes.forEach((data) => {
            finish.push(
                <Link
                    key={data.name}
                    href={data.route}
                    className="flex flex-col w-[270px] gap-3 p-[10px] shadow-around-sm shadow-text-20 bg-background rounded-xl"
                >
                    <div className="flex justify-center items-center text-white hover:text-white">
                        <Image
                            src={data.image}
                            alt={`Image`}
                            className="rounded-lg"
                        />
                        <h1 className=" absolute blur-lg text-blue-600 font-black text-5xl uppercase">
                            {data.name}
                        </h1>
                        <h1 className=" absolute font-black text-5xl uppercase text-white hover:text-white">
                            {data.name}
                        </h1>
                    </div>
                    <p className=" text-pretty text-white hover:text-white">
                        {data.description}
                    </p>
                </Link>
            );
        });
        return finish;
    };

    return (
        <div className="w-full flex h-full items-center justify-center flex-col gap-[80px] px-[15px]">
            <div className="flex flex-col justify-center items-center">
                <h1>Game Modes</h1>
            </div>
            <div className="w-fit flex justify-center flex-wrap gap-10 shadow-around shadow-text-20 bg-background py-[40px] px-[30px] rounded-xl ">
                <LoadModes />
            </div>
        </div>
    );
}

Page.getLayout = function getLayout(page) {
    return <LayoutOne>{page}</LayoutOne>;
};

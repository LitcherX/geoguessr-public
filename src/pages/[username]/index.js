import { apiCall } from "@/_lib/components/global";
import LayoutProfile from "@/_lib/layouts/layoutProfile";
import { generateToken } from "@/_utils/jwt";
import { auth } from "@/app/auth";
import { startsWith } from "lodash";
import { Tooltip } from "react-tooltip";
import Image from "next/image";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page(props) {
    const { username, user, data } = props;
    return (
        <div>
            <div className=" flex gap-16 flex-row items-center flex-wrap max-[800px]:justify-center">
                <div className="flex w-[150px] h-auto flex-wrap">
                    <Image
                        src={user.image}
                        width={150}
                        height={150}
                        alt={`Profile picture`}
                        className=" rounded-full"
                    />
                    <div className=" absolute w-[150px] h-[150px] flex items-end justify-end flex-wrap">
                        <Tooltip id="my-tooltip" />

                        <div
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={
                                user.lobbyId === null
                                    ? `Last seen: ${new Date(
                                          user.updatedAt
                                      ).toLocaleString()}`
                                    : `Currently In-game`
                            }
                            data-tooltip-place="top"
                            suppressHydrationWarning
                            className={`w-[25px] h-[25px] ${
                                user.lobbyId === null
                                    ? " bg-red-700"
                                    : " bg-green-700"
                            } rounded-full -translate-x-3 -translate-y-3 border-background border-[4px]`}
                        ></div>
                    </div>
                </div>
                <div className=" flex flex-col w-max items-center gap-6 flex-wrap">
                    <div className=" flex flex-row gap-5 flex-wrap max-[600px]:justify-center">
                        <div className=" items-center justify-center flex flex-col flex-wrap">
                            <p>
                                {(
                                    Number(user?.scoreEver) /
                                    Number(user?.playsEver)
                                ).toFixed(2)}
                            </p>
                            <h6>Avg. Points</h6>
                        </div>
                        <div className=" items-center justify-center flex flex-col">
                            <p>
                                {(user?.timeEver / user?.playsEver).toFixed(2)}s
                            </p>
                            <h6>Avg. Time</h6>
                        </div>
                        <div className=" items-center justify-center flex flex-col">
                            <p>{user?.playsEver}</p>
                            <h6>All Plays</h6>
                        </div>
                    </div>
                    <div className=" flex flex-row justify-around w-full">
                        <p>
                            {data.user.Leaderboard
                                ? `Ranked #${data.user.Leaderboard.rank} Globally`
                                : "Can't decide rank"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

Page.getLayout = function getLayout(page) {
    return <LayoutProfile>{page}</LayoutProfile>;
};

export async function getServerSideProps(ctx) {
    const { params } = ctx;
    const { username } = params;
    const session = await auth(ctx);
    const token = generateToken(session?.user.id);
    const { req } = ctx;

    // Extract headers
    const headers = {};
    Object.keys(req.headers).forEach((key) => {
        headers[key.toLowerCase()] = req.headers[key];
    });
    const check = await apiCall(
        "getUser",
        "POST",
        { server: true, headers },
        { username: username.replace("@", "") }
    );
    if (!startsWith(username, "@") || check.status !== 200) {
        return {
            notFound: true,
        };
    }
    return {
        props: {
            username: username,
            user: check.user,
            data: check,
        },
    };
}

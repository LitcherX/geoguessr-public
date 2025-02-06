import LayoutOne from "@lib/layouts/layoutOne";
import * as fs from "node:fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import Link from "next/link";

export async function getServerSideProps() {
    const dirPath = path.join(process.cwd(), "public", "updates");
    const entries = fs.readdirSync(dirPath);
    let folders = entries.filter((entry) =>
        fs.statSync(path.join(dirPath, entry)).isDirectory()
    );
    const updateData = [];
    for (let i = 0; i <= folders.length - 1; i++) {
        const dataPath = path.join(
            process.cwd(),
            "public",
            "updates",
            `${folders[i]}`,
            "data.json"
        );
        const dataContent = await fs.promises.readFile(dataPath, "utf8");
        const jsonData = JSON.parse(dataContent);

        const textPath = path.join(
            process.cwd(),
            "public",
            "updates",
            `${folders[i]}`,
            "text.mdx"
        );
        const textContent = await fs.promises.readFile(textPath, "utf8");

        updateData.push({
            jsonData,
            textContent: await serialize(textContent),
        });
    }
    return {
        props: {
            updateData: updateData.reverse(),
        },
    };
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page(props) {
    const { updateData } = props;
    function DisplayUpdates() {
        const updates = [];
        updateData.forEach(async (d, i) => {
            const { jsonData, textContent } = d;
            const { title, description, timestamp, version } = jsonData;
            updates.push(
                <Link
                    href={`/updates/${updateData.length - i}`}
                    className=" w-[700px] max-w-[100%] bg-primary-20 py-[10px] px-[20px] rounded-xl"
                    key={i}
                >
                    <h4 className=" flex flex-row gap-4 items-center text-text hover:text-text">
                        {title}
                        <p className=" text-base text-text hover:text-text">
                            v{version}
                        </p>
                    </h4>
                    <p className="text-text hover:text-text">{description}</p>
                    <p className=" text-sm text-text hover:text-text">
                        {timestamp}
                    </p>
                </Link>
            );
        });
        return updates;
    }
    return (
        <div className="w-full flex h-auto items-center justify-center flex-col gap-[80px]">
            <div className="flex flex-col justify-center items-center">
                <h1>Updates</h1>
            </div>
            <div className="w-full flex flex-col items-center gap-8 p-[20px] rounded-xl bg-background max-w-[100vw]">
                <DisplayUpdates />
            </div>
        </div>
    );
}

Page.getLayout = function getLayout(page) {
    return <LayoutOne>{page}</LayoutOne>;
};

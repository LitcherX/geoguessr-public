import LayoutOne from "@lib/layouts/layoutOne";
import * as fs from "node:fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

export async function getServerSideProps(ctx) {
    const { params } = ctx;
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
    if (
        isNaN(params.id) ||
        Number(params.id) > updateData.length ||
        Number(params.id) < 1
    ) {
        return {
            notFound: true,
        };
    }
    return {
        props: {
            updateData,
            params,
        },
    };
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Page(props) {
    const { updateData, params } = props;
    function DisplayUpdates() {
        const updates = [];
        const d = updateData[Number(params.id) - 1];
        const { jsonData, textContent } = d;
        const { title, description, timestamp, version } = jsonData;
        return (
            <div>
                <MDXRemote
                    {...textContent}
                    scope={{ title, version, timestamp }}
                />
            </div>
        );
    }
    return (
        <div className=" flex h-auto items-center w-[1000px] justify-center flex-col gap-[80px]">
            <div className="w-full flex flex-col h-full">
                <DisplayUpdates />
            </div>
        </div>
    );
}

Page.getLayout = function getLayout(page) {
    return <LayoutOne>{page}</LayoutOne>;
};

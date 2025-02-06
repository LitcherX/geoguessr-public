import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export const dynamic = "auto"; // or 'force-dynamic', 'error', 'force-static'
export const runtime = "nodejs"; // or 'edge'
export const revalidate = false;

export async function POST(request) {
    const body = await request.json();

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                return {
                    allowedContentTypes: [
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                    ],
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                console.log("blob upload completed", blob, tokenPayload);

                try {
                    const { userId } = JSON.parse(tokenPayload);
                } catch (error) {
                    throw new Error("Could not update user");
                }
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

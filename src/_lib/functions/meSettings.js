import { auth } from "@/app/auth";
import { apiCall } from "@/_lib/components/global";

export default async function settings(ctx) {
    const session = await auth(ctx);
    const username = session.user.uniqueName;
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
    return check;
}

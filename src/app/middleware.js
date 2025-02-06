import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    if (!req.auth) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
});

export const config = {
    matcher: ["/play/vs/(.*)", "/me", "/locations"],
};

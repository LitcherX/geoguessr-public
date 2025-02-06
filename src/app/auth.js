import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "@/_lib/database/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        DiscordProvider({
            clientId: process.env.AUTH_DISCORD_ID,
            clientSecret: process.env.AUTH_DISCORD_SECRET,
            token: {
                url: process.env.DISCORD_TOKEN_URL,
                conform: async function (response) {
                    if (response.status === 401) return response;
                    const newHeaders = Array.from(response.headers.entries())
                        .filter(
                            ([key]) => key.toLowerCase() !== "www-authenticate"
                        )
                        .reduce((headers, [key, value]) => {
                            headers.append(key, value);
                            return headers;
                        }, new Headers());
                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders,
                    });
                },
            },
        }),
    ],
});

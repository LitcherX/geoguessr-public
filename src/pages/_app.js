import "@lib/css/global.css";
import { AppProps } from "next/app";
import { MDXProvider } from "@mdx-js/react";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/next";

export default function MyApp({
    Component,
    pageProps: { session, ...pageProps },
}) {
    const getLayout = Component.getLayout ?? ((page) => page);

    return getLayout(
        <SessionProvider session={session}>
            <MDXProvider>
                <Component {...pageProps} />
                <Analytics />
            </MDXProvider>
        </SessionProvider>
    );
}

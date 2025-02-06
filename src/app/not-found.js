"use client";
import Link from "next/link";
import "@lib/css/global.css";
import LayoutMain from "@/_lib/layouts/layoutMain";

export default function NotFound() {
    return (
        <LayoutMain>
            <div className="h-screen w-screen bg-background flex items-center justify-center">
                <div>
                    <h1>Not found – 404!</h1>
                    <div>
                        <Link href="/">Go back to Home</Link>
                    </div>
                </div>
            </div>
        </LayoutMain>
    );
}

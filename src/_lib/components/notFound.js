import notFoundImage from "@public/images/404.png";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex items-center justify-center flex-col h-full bg-background text-text font-poppins">
            <div className="flex flex-row items-center justify-evenly gap-10 w-[1100px]">
                <Image src={notFoundImage} className="w-[300px]" />
                <div className="flex gap-4 flex-col">
                    <h1 className="text-6xl">Page not found</h1>
                    <Link href={"/"}>You might want to go back</Link>
                </div>
            </div>
        </div>
    );
}

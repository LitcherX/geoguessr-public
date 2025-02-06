import { notFound } from "next/navigation";
import useThemeChange from "@lib/functions/useThemeChange";

export default function NotFoundCatchAll() {
    notFound();
}

"use client";
import {
    setCookie,
    deleteCookie,
    hasCookie,
    getCookie,
    getCookies,
} from "cookies-next";
import { useEffect, useState } from "react";

function useDarkMode() {
    const [theme, setTheme] = useState(
        hasCookie("theme")
            ? getCookie("theme")
            : () => {
                  setCookie("theme", "auto");
                  return "auto";
              }
    );
    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove(
            theme === "auto"
                ? !window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
                : theme !== "dark"
                ? "dark"
                : "light"
        );
        root.classList.add(
            theme === "auto"
                ? window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
                : theme === "dark"
                ? "dark"
                : "light"
        );
        setCookie("theme", theme);
    }, [theme]);
    return [theme, setTheme];
}

export default useDarkMode;

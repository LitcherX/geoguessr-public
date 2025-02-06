"use client";
import { useEffect } from "react";
import { getCookie } from "cookies-next";

const useThemeChange = (callback) => {
    const handleThemeChange = () => {
        callback();
    };

    useEffect(() => {
        const mediaQueryList = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );
        const listener = (e) => {
            const theme = getCookie("theme");
            const root = window.document.documentElement;
            if (theme === "dark") {
                root.classList.remove("light");
                root.classList.add("dark");
            } else if (theme === "light") {
                root.classList.remove("dark");
                root.classList.add("light");
            } else if (theme === "auto") {
                root.classList.remove(
                    theme === "auto"
                        ? !mediaQueryList.matches
                            ? "dark"
                            : "light"
                        : theme !== "dark"
                        ? "dark"
                        : "light"
                );
                root.classList.add(
                    theme === "auto"
                        ? mediaQueryList.matches
                            ? "dark"
                            : "light"
                        : theme === "dark"
                        ? "dark"
                        : "light"
                );
            }
        };
        listener();
        mediaQueryList.addEventListener("change", listener);

        return () => {
            mediaQueryList.removeEventListener("change", listener);
        };
    }, []);
};

export default useThemeChange;

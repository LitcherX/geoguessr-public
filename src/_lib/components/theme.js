import { faSun } from "@fortawesome/free-regular-svg-icons";
import { faMoon } from "@fortawesome/free-regular-svg-icons";
import { faComputer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ThemeButton({ theme, setTheme }) {
    return (
        <div
            className={`w-[84px] h-[28px] flex items-center rounded-full bg-background border-text-50 border-[2px] !border-opacity-20 ${
                theme === "dark" ? "!border-r-opacity-100" : ""
            }`}
        >
            <button
                className={`w-[28px] h-[28px] flex justify-center items-center border-r-[1px] border-t-[1px] border-b-[1px] rounded-full ${
                    theme === "dark"
                        ? " border-text!border-opacity-20"
                        : " border-transparent opacity-55 "
                }`}
                onClick={(e) => {
                    setTheme("dark");
                }}
            >
                <FontAwesomeIcon icon={faMoon} className=" h-[13px] w-auto" />
            </button>
            <button
                className={`w-[28px] h-[28px] flex justify-center items-center border-[1px] rounded-full ${
                    theme === "light"
                        ? " border-text !border-opacity-20"
                        : " border-transparent opacity-55 "
                }`}
                onClick={(e) => {
                    setTheme("light");
                }}
            >
                <FontAwesomeIcon icon={faSun} className=" h-[13px] w-auto" />
            </button>
            <button
                className={`w-[28px] h-[28px] flex justify-center items-center border-l-[1px] border-t-[1px] border-b-[1px] rounded-full ${
                    theme === "auto"
                        ? " border-text !border-opacity-20"
                        : " border-transparent opacity-55 "
                }`}
                onClick={(e) => {
                    setTheme("auto");
                }}
            >
                <FontAwesomeIcon
                    icon={faComputer}
                    className=" h-[13px] w-auto"
                />
            </button>
        </div>
    );
}

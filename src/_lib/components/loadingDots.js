export default function LoadingDots({ size }) {
    return (
        <div
            style={{ gap: `${size / 4}px` }}
            className="flex justify-center items-center h-full"
        >
            <span className="sr-only">Loading...</span>
            <div
                style={{ width: `${size}px`, height: `${size}px` }}
                className="bg-primary-70 rounded-full animate-bounce [animation-delay:-0.3s]"
            ></div>
            <div
                style={{ width: `${size}px`, height: `${size}px` }}
                className="bg-primary-70 rounded-full animate-bounce [animation-delay:-0.15s]"
            ></div>
            <div
                style={{ width: `${size}px`, height: `${size}px` }}
                className="bg-primary-70 rounded-full animate-bounce"
            ></div>
        </div>
    );
}

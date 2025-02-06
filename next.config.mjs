/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["next-mdx-remote"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
};

export default nextConfig;

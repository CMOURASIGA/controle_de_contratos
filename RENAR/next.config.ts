import type { NextConfig } from "next";

const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").trim() || "http://localhost";
const urlApi = new URL(rawApiUrl.includes("://") ? rawApiUrl : `http://${rawApiUrl}`);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: urlApi.hostname,
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "ufs.sh" },
      { protocol: "https", hostname: "qonvip.com" },
      { protocol: "https", hostname: "*.qonvip.com" },
    ],
  },
  experimental: {
   
    serverActions: {
      allowedOrigins: ["qonvip.com", "*.qonvip.com", "localhost:3000"],
    },
  },
};

export default nextConfig;
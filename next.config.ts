import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'k6hrqrxuu8obbfwn.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;

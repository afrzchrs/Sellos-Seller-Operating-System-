import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  allowedDevOrigins: ['cd55-114-10-149-98.ngrok-free.app'],
};

export default nextConfig;

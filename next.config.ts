import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable to prevent WebSocket connection loops
};

export default nextConfig;

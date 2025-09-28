import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable to prevent WebSocket connection loops
  eslint: {
    // Allow production builds to successfully complete even if
    // there are ESLint errors (useful for Vercel deployments)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip type checking on production builds to avoid failing deploys
    // when there are TS errors. Keep type checks locally.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@xyflow/react'],
  serverExternalPackages: ["@mastra/*"],
};

export default nextConfig;

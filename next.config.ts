import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { dev }) => {
    if (dev) {
      config.devServer = config.devServer || {};
      config.devServer.client = config.devServer.client || {};
      config.devServer.client.overlay = false; // Disable error overlay
    }
    return config;
  }
};

export default nextConfig;

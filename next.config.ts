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
  },
  // Vercel-specific optimizations
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Increase body size limit for file uploads
  serverRuntimeConfig: {
    maxFileSize: '400mb',
  },
  // Optimize for serverless
  output: 'standalone',
};

export default nextConfig;

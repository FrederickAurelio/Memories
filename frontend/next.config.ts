import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };
    return config;
  },
  images: {
    domains: ["avatars.githubusercontent.com"], // Allow GitHub avatars
  },
};

export default nextConfig;

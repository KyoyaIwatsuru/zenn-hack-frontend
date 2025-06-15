import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/zenn-hack-backend.firebasestorage.app/**',
      },
    ],
  },
};

export default nextConfig;

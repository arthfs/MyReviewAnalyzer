import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.12.60', 'localhost:3000', '127.0.0.1:3000', '127.0.0.1:8000'],
  output: "standalone",  // This is fine for both Docker and Amplify
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
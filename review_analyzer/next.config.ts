import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.12.60', 'localhost:3000', '127.0.0.1:3000', '127.0.0.1:8000'],
  
  // If you need standalone output for Docker
  output: "standalone",
  
  // Other config options...
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "rekrutmen.ridjstudio.cloud",
    // opsional:
    // "localhost",
    "*.ridjstudio.cloud",
  ],
};

export default nextConfig;

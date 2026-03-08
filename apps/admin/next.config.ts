import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@clerk/nextjs", "convex"],
  },
  serverExternalPackages: ["@opentelemetry/api"],
};

export default nextConfig;
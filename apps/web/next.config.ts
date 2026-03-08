import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@opentelemetry/api", "@serwist/next"],
};

export default nextConfig;
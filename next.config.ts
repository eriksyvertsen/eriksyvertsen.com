import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@anthropic-ai/sdk"],
  async redirects() {
    return [
      {
        source: "/legal-engineering",
        destination: "/musings",
        permanent: true,
      },
      {
        source: "/legal-engineering/:slug",
        destination: "/musings/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@anthropic-ai/sdk"],
  outputFileTracingIncludes: {
    "/mountains": ["./content/mountains/**/*", "./public/mountains/**/*"],
    "/musings": ["./content/musings/**/*"],
    "/musings/[slug]": ["./content/musings/**/*"],
    "/reading": ["./content/reading/**/*"],
    "/apps": ["./content/apps/**/*"],
    "/kernels": ["./content/kernels/**/*"],
    "/about": ["./content/pages/**/*"],
    "/": ["./content/**/*"],
  },
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

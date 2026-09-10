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
  // Multi-zone: the ADK snowpack app is a separate Vercel project mounted at /snowpack
  // (NEXT_PUBLIC_BASE_PATH=/snowpack there), proxied through so it lives on this domain.
  async rewrites() {
    return [
      {
        source: "/snowpack",
        destination: "https://adk-snowpack.vercel.app/snowpack",
      },
      {
        source: "/snowpack/:path*",
        destination: "https://adk-snowpack.vercel.app/snowpack/:path*",
      },
    ];
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

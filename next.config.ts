
import type { NextConfig } from "next";

const authServerUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${authServerUrl}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;

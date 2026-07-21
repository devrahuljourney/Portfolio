import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the tracing root to this project (silences the multi-lockfile warning).
  outputFileTracingRoot: path.join(process.cwd()),
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;

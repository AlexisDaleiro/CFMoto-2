import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return process.env.VERCEL_ENV === "preview" || process.env.SITE_INDEXABLE !== "true"
      ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }]
      : [];
  },
  images: { formats: ["image/avif", "image/webp"], qualities: [65, 75, 85], deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600, 1920] },
  poweredByHeader: false,
};
export default nextConfig;

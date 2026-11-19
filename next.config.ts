import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-only "N" badge; compile/runtime errors still show.
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // AVIF first, WebP fallback (SPEC §7). Widths match the 480/768/1080
    // targets; 1536 is the source width, so nothing is ever upscaled.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 768, 1080, 1536],
    imageSizes: [96, 256, 384],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/OpenScholarFinder",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

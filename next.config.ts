import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export to out/, hosted on S3 + CloudFront (see deploy/README.md)
  output: "export",
  // Emit dir/index.html so CloudFront can map /path/ to an S3 object
  trailingSlash: true,
  // The default image loader needs a Node server, which a static export doesn't have
  images: { unoptimized: true },
};

export default nextConfig;

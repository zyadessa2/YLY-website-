import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // This will disable type checking during build!
    // Only use this as a last resort
    ignoreBuildErrors: true,
  },
  experimental: {
    scrollRestoration: true
  },
  // Define supported page extensions
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  // Configure next-intl
  // experimental: {
  //   typedRoutes: true,
  // },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

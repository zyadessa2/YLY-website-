import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  // Define supported page extensions
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  // Configure images for Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tbnijxfllcwfvhdjppns.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      // Add a generic pattern for any Supabase project
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Configure next-intl
  // experimental: {
  //   typedRoutes: true,
  // },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

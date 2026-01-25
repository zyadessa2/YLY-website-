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
  // Configure images for Supabase storage and Google Drive
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tbnijxfvhdjppns.supabase.co",
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
      // Google Drive images
      {
        protocol: "https",
        hostname: "drive.google.com",
        port: "",
        pathname: "/**",
      },
      // Google Drive direct link
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
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

import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // This helps with hydration
  experimental: {
    // This helps prevent certain hydration issues
    scrollRestoration: true,
  },
  // Configure next-intl
  // experimental: {
  //   typedRoutes: true,
  // },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

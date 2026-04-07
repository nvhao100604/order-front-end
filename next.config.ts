import type { NextConfig } from "next";

// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Các cấu hình hiện tại của bạn (nếu có)
}

module.exports = withBundleAnalyzer(nextConfig)
// const nextConfig: NextConfig = {
//   /* config options here */
// };

export default nextConfig;

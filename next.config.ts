import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autoriser images externes (logos commerce hébergés sur Supabase, QR API, Google SDK)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "api.qrserver.com" },
      { protocol: "https", hostname: "www.svgrepo.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
  // Pas de bundling lourd
  reactStrictMode: true,
};

export default nextConfig;

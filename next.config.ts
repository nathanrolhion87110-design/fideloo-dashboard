// Cache busted: 2026-05-15
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compression gzip côté Next (Vercel le fait déjà mais on garde pour le self-host)
  compress: true,

  // Cache le header X-Powered-By
  poweredByHeader: false,

  reactStrictMode: true,

  // Autoriser images externes (logos commerce hébergés sur Supabase, QR API, Google SDK)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "api.qrserver.com" },
      { protocol: "https", hostname: "www.svgrepo.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
};

export default nextConfig;

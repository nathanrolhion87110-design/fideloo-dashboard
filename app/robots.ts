import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://fideloo-dashboard-njfq.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/dashboard/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

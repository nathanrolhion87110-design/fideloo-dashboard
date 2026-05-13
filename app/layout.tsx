import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import TawkTo from "../components/TawkTo";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://fideloo-dashboard-njfq.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Fideloo — Carte de fidélité digitale pour votre commerce",
  description:
    "Créez une carte de fidélité numérique qui s'ajoute dans Apple Wallet et Google Wallet. Sans app, sans friction. Essai gratuit.",
  keywords: ["carte fidélité", "Apple Wallet", "Google Wallet", "fidélisation client", "commerce", "loyalty card"],
  authors: [{ name: "Fideloo" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Fideloo — Carte de fidélité digitale",
    description: "La carte de fidélité qui s'ajoute dans Apple Wallet et Google Wallet",
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Fideloo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fideloo — Carte de fidélité digitale",
    description: "La carte de fidélité qui s'ajoute dans Apple Wallet et Google Wallet",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`h-full antialiased ${sora.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
        <TawkTo />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import TawkTo from "../components/TawkTo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://fideloo-dashboard-njfq.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Fideloo — Carte de fidélité digitale pour votre commerce",
  description:
    "Créez une carte de fidélité numérique qui s'ajoute dans Apple Wallet et Google Wallet. Sans app, sans friction. Essai gratuit.",
  keywords: ["carte fidélité", "Apple Wallet", "Google Wallet", "fidélisation client", "commerce", "loyalty card", "fidélité digitale"],
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
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col text-text-main font-sans" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
        <TawkTo />
      </body>
    </html>
  );
}

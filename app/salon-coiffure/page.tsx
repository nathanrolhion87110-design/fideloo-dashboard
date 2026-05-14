import type { Metadata } from "next";
import Link from "next/link";
import { Check, Star } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://fideloo-dashboard-njfq.vercel.app";

export const metadata: Metadata = {
  title: "Carte de fidélité pour salon de coiffure | Fideloo",
  description: "Créez un programme de fidélité pour votre salon de coiffure en 2 minutes. Carte dans Apple Wallet. 5 coupes = 1 soin offert. Sans app. Essai gratuit.",
  keywords: ["carte fidélité coiffeur", "programme fidélité salon coiffure", "fidélisation client salon", "Apple Wallet coiffeur", "loyalty card hairdresser"],
  alternates: { canonical: `${SITE_URL}/salon-coiffure` },
  openGraph: {
    title: "Carte de fidélité pour salon de coiffure — Fideloo",
    description: "5 coupes = 1 soin offert. Apple Wallet & Google Wallet.",
    url: `${SITE_URL}/salon-coiffure`,
  },
};

const BG   = "#EDEBE4";
const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const WHITE = "#FFFFFF";
const GRAY  = "#6B6B6B";
const BORD  = "#E0DDD6";
const GS    = "rgba(184,135,58,0.10)";
const GB    = "rgba(184,135,58,0.25)";

export default function SalonCoiffurePage() {
  const px = { paddingLeft: "clamp(24px, 6vw, 80px)", paddingRight: "clamp(24px, 6vw, 80px)" };

  return (
    <div style={{ background: BG, minHeight: "100vh", color: INK }}>
      <header style={{ borderBottom: `1px solid ${BORD}`, background: WHITE }}>
        <div style={{ ...px, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <img src="/brand/fideloo-logo-linked.svg" alt="Fideloo" style={{ height: 30, width: "auto", display: "block" }} />
          </Link>
          <Link href="/register" style={{ padding: "9px 20px", background: INK, color: WHITE, borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)" }}>
            Essai gratuit ↗
          </Link>
        </div>
      </header>

      <main>
        <section style={{ ...px, paddingTop: 80, paddingBottom: 80, maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="commerce-hero-grid">
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: GRAY, marginBottom: 16, fontFamily: "var(--font-sora, system-ui)" }}>— SALON DE COIFFURE</div>
              <h1 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: "clamp(34px, 4.5vw, 58px)", lineHeight: 1.12, marginBottom: 20 }}>
                Carte de fidélité
                <em style={{ display: "block", fontStyle: "italic", color: GOLD }}>pour salon de coiffure.</em>
              </h1>
              <p style={{ fontSize: 17, color: GRAY, lineHeight: 1.7, marginBottom: 32 }}>
                Fideloo transforme votre salon en commerce qui fidélise — sans carte papier, sans tampon. Vos clientes cumulen des points à chaque visite, directement dans leur Wallet.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: INK, color: WHITE, borderRadius: 999, fontSize: 15, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)" }}>
                  Créer ma carte salon →
                </Link>
                <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: WHITE, color: INK, borderRadius: 999, fontSize: 15, fontWeight: 600, border: `1px solid ${BORD}`, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)" }}>
                  Voir la démo
                </Link>
              </div>
            </div>

            <div style={{ background: INK, borderRadius: 20, padding: 28, color: WHITE, boxShadow: "0 24px 60px rgba(11,15,14,0.15)", maxWidth: 360, margin: "0 auto" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: GOLD, marginBottom: 4, fontFamily: "var(--font-sora, system-ui)" }}>FIDÉLITÉ</div>
              <div style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Salon Élise</div>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 40, borderRadius: 8, background: i < 3 ? GOLD : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {i < 3 && <Check size={16} color={INK} />}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 16, fontFamily: "var(--font-sora, system-ui)" }}>3 / 5 coupes</div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14, fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-sora, system-ui)" }}>
                Récompense : 1 soin offert
              </div>
            </div>
          </div>
        </section>

        <section style={{ background: GS, border: `1px solid ${GB}`, borderRadius: 24, ...px, paddingTop: 56, paddingBottom: 56, margin: "0 clamp(24px, 6vw, 80px) 80px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "clamp(22px, 2.8vw, 32px)", fontWeight: 600, color: INK, marginBottom: 16 }}>
              5 coupes = 1 soin offert
            </h2>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.7 }}>
              Définissez librement votre récompense : soin, brushing offert, remise. Vos clientes reçoivent une notification push sur leur téléphone dès que leur récompense est disponible.
            </p>
          </div>
        </section>

        <section style={{ background: INK, ...px, paddingTop: 60, paddingBottom: 60 }}>
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 20 }}>
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={18} color={GOLD} fill={GOLD} />)}
            </div>
            <blockquote style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 400, color: WHITE, lineHeight: 1.5, marginBottom: 24, fontStyle: "italic" }}>
              &ldquo;Avant, les cartes papier finissaient perdues ou froissées. Maintenant mes clientes ont leur carte dans leur iPhone — elles ne l&apos;oublient jamais. Mon taux de retour a augmenté de 40%.&rdquo;
            </blockquote>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sora, system-ui)" }}>
              Élise Laurent · <strong style={{ color: "rgba(255,255,255,0.7)" }}>Salon Élise, Bordeaux</strong>
            </div>
          </div>
        </section>

        <section style={{ ...px, paddingTop: 72, paddingBottom: 80, textAlign: "center" }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: "clamp(26px, 3.5vw, 44px)", lineHeight: 1.2, marginBottom: 16 }}>
              Fidélisez vos clientes <em style={{ fontStyle: "italic", color: GOLD }}>simplement.</em>
            </h2>
            <p style={{ fontSize: 16, color: GRAY, marginBottom: 32, lineHeight: 1.6 }}>
              Setup en 2 minutes · Sans carte bancaire · Essai gratuit 14 jours
            </p>
            <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 36px", background: INK, color: WHITE, borderRadius: 999, fontSize: 16, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)" }}>
              Créer ma carte salon →
            </Link>
          </div>
        </section>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .commerce-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </div>
  );
}

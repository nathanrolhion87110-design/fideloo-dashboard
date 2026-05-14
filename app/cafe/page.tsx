import type { Metadata } from "next";
import Link from "next/link";
import { Check, Star, Coffee } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://fideloo-dashboard-njfq.vercel.app";

export const metadata: Metadata = {
  title: "Carte de fidélité pour café — Google Wallet | Fideloo",
  description: "Carte de fidélité pour café intégrée à Google Wallet et Apple Wallet. 10 cafés = 1 offert. Sans app à télécharger. Setup en 2 minutes. Essai gratuit.",
  keywords: ["carte fidélité café", "programme fidélité café", "fidélisation client café", "Google Wallet café", "loyalty card coffee shop"],
  alternates: { canonical: `${SITE_URL}/cafe` },
  openGraph: {
    title: "Carte de fidélité pour café — Fideloo",
    description: "10 cafés = 1 offert. Google Wallet & Apple Wallet.",
    url: `${SITE_URL}/cafe`,
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

export default function CafePage() {
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
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: GRAY, marginBottom: 16, fontFamily: "var(--font-sora, system-ui)" }}>— CAFÉ</div>
              <h1 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: "clamp(34px, 4.5vw, 58px)", lineHeight: 1.12, marginBottom: 20 }}>
                Carte de fidélité pour café —
                <em style={{ display: "block", fontStyle: "italic", color: GOLD }}>Google Wallet.</em>
              </h1>
              <p style={{ fontSize: 17, color: GRAY, lineHeight: 1.7, marginBottom: 32 }}>
                Vos clients habituels méritent mieux qu&apos;une carte papier. Fideloo leur offre une carte de fidélité dans leur téléphone — Google Wallet ou Apple Wallet — qu&apos;ils ne perdront jamais.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: INK, color: WHITE, borderRadius: 999, fontSize: 15, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)" }}>
                  Créer ma carte café →
                </Link>
                <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: WHITE, color: INK, borderRadius: 999, fontSize: 15, fontWeight: 600, border: `1px solid ${BORD}`, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)" }}>
                  Voir la démo
                </Link>
              </div>
            </div>

            <div style={{ background: INK, borderRadius: 20, padding: 28, color: WHITE, boxShadow: "0 24px 60px rgba(11,15,14,0.15)", maxWidth: 360, margin: "0 auto" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: GOLD, marginBottom: 4, fontFamily: "var(--font-sora, system-ui)" }}>FIDÉLITÉ</div>
              <div style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Le Bon Café</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: i < 8 ? GOLD : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {i < 8 && <Coffee size={13} color={INK} />}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 16, fontFamily: "var(--font-sora, system-ui)" }}>8 / 10 cafés</div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14, fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-sora, system-ui)" }}>
                Récompense : 1 café offert ☕
              </div>
            </div>
          </div>
        </section>

        <section style={{ background: GS, border: `1px solid ${GB}`, borderRadius: 24, ...px, paddingTop: 56, paddingBottom: 56, margin: "0 clamp(24px, 6vw, 80px) 80px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "clamp(22px, 2.8vw, 32px)", fontWeight: 600, color: INK, marginBottom: 16 }}>
              10 cafés = 1 café offert
            </h2>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.7 }}>
              Votre barista scanne la carte en 2 secondes depuis son terminal ou son téléphone. Le compteur se met à jour en temps réel. À 10 cafés, votre client reçoit une notification et son café gratuit est prêt.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 28, flexWrap: "wrap" }}>
              {[
                { label: "Aucune app à télécharger", icon: Check },
                { label: "Google Wallet & Apple Wallet", icon: Check },
                { label: "Notifications push automatiques", icon: Check },
              ].map(({ label, icon: Icon }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: GB, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={10} color={GOLD} />
                  </div>
                  <span style={{ fontSize: 13, color: GRAY, fontFamily: "var(--font-sora, system-ui)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: INK, ...px, paddingTop: 60, paddingBottom: 60 }}>
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 20 }}>
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={18} color={GOLD} fill={GOLD} />)}
            </div>
            <blockquote style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 400, color: WHITE, lineHeight: 1.5, marginBottom: 24, fontStyle: "italic" }}>
              &ldquo;J&apos;avais peur que ce soit compliqué à mettre en place, mais en 10 minutes tout était prêt. Mes réguliers adorent — ils vérifient leurs points dès qu&apos;ils rentrent dans le café.&rdquo;
            </blockquote>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sora, system-ui)" }}>
              Ahmed Kacem · <strong style={{ color: "rgba(255,255,255,0.7)" }}>Le Bon Café, Paris</strong>
            </div>
          </div>
        </section>

        <section style={{ ...px, paddingTop: 72, paddingBottom: 80, textAlign: "center" }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: "clamp(26px, 3.5vw, 44px)", lineHeight: 1.2, marginBottom: 16 }}>
              Le café des <em style={{ fontStyle: "italic", color: GOLD }}>fidèles.</em>
            </h2>
            <p style={{ fontSize: 16, color: GRAY, marginBottom: 32, lineHeight: 1.6 }}>
              Setup en 2 minutes · Sans carte bancaire · Essai gratuit 14 jours
            </p>
            <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 36px", background: INK, color: WHITE, borderRadius: 999, fontSize: 16, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)" }}>
              Créer ma carte café →
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

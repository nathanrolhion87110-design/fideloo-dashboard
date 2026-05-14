import type { Metadata } from "next";
import Link from "next/link";
import { Check, QrCode, Wallet, Star } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://fideloo-dashboard-njfq.vercel.app";

export const metadata: Metadata = {
  title: "Carte de fidélité pour boulangerie — Sans app | Fideloo",
  description: "Créez une carte de fidélité pour votre boulangerie en 2 minutes. Intégrée à Apple Wallet et Google Wallet. Pas d'app à télécharger. Essai gratuit.",
  keywords: ["carte fidélité boulangerie", "programme fidélité boulangerie", "fidélisation client boulangerie", "Apple Wallet boulangerie", "loyalty card bakery"],
  alternates: { canonical: `${SITE_URL}/boulangerie` },
  openGraph: {
    title: "Carte de fidélité pour boulangerie — Fideloo",
    description: "10 baguettes achetées = 1 offerte. Sans app, sans friction.",
    url: `${SITE_URL}/boulangerie`,
  },
};

const BG   = "#EDEBE4";
const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const WHITE = "#FFFFFF";
const GRAY  = "#6B6B6B";
const CARD  = "#F5F3EE";
const BORD  = "#E0DDD6";
const GS    = "rgba(184,135,58,0.10)";
const GB    = "rgba(184,135,58,0.25)";

export default function BoulangeriePage() {
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
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: GRAY, marginBottom: 16, fontFamily: "var(--font-sora, system-ui)" }}>
                — BOULANGERIE
              </div>
              <h1 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: "clamp(34px, 4.5vw, 58px)", lineHeight: 1.12, marginBottom: 20 }}>
                Carte de fidélité pour boulangerie —
                <em style={{ display: "block", fontStyle: "italic", color: GOLD }}>sans app.</em>
              </h1>
              <p style={{ fontSize: 17, color: GRAY, lineHeight: 1.7, marginBottom: 32 }}>
                Fideloo donne à votre boulangerie une carte de fidélité digitale qui s&apos;ajoute directement à Apple Wallet et Google Wallet. Vos clients n&apos;ont rien à télécharger — ils scannent et collectent leurs points en 10 secondes.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: INK, color: WHITE, borderRadius: 999, fontSize: 15, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)" }}>
                  Créer ma carte boulangerie →
                </Link>
                <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: WHITE, color: INK, borderRadius: 999, fontSize: 15, fontWeight: 600, border: `1px solid ${BORD}`, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)" }}>
                  Voir la démo
                </Link>
              </div>
            </div>

            {/* Wallet card mockup */}
            <div>
              <div style={{ background: INK, borderRadius: 20, padding: 28, color: WHITE, boxShadow: "0 24px 60px rgba(11,15,14,0.15)", maxWidth: 360, margin: "0 auto" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: GOLD, marginBottom: 4, fontFamily: "var(--font-sora, system-ui)" }}>FIDÉLITÉ</div>
                <div style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Boulangerie Martin</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 16 }}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} style={{ height: 32, borderRadius: 6, background: i < 7 ? GOLD : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {i < 7 && <Check size={14} color={INK} />}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 16, fontFamily: "var(--font-sora, system-ui)" }}>7 / 10 baguettes</div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14, fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-sora, system-ui)" }}>
                  Récompense : 1 baguette offerte
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example + features */}
        <section style={{ ...px, paddingBottom: 80, maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="commerce-feat-grid">
            <div style={{ background: GS, border: `1px solid ${GB}`, borderRadius: 20, padding: 36 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: GOLD, marginBottom: 16, fontFamily: "var(--font-sora, system-ui)" }}>EXEMPLE CONCRET</div>
              <h2 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 600, color: INK, marginBottom: 16 }}>
                10 baguettes achetées = 1 baguette offerte
              </h2>
              <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.7 }}>
                Chaque achat, votre boulanger scanne le QR code du client. À 10 points, la carte se débloque automatiquement avec une notification sur le téléphone du client. Zéro carte papier. Zéro oubli.
              </p>
            </div>

            <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 20, padding: 36 }}>
              <h3 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 20, fontWeight: 600, color: INK, marginBottom: 20 }}>Ce qui est inclus</h3>
              <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  "Carte dans Apple Wallet & Google Wallet",
                  "QR code personnalisé prêt à imprimer",
                  "Mise à jour des points en temps réel",
                  "Notifications push à vos clients",
                  "Analytics : fréquence, top clients",
                  "Setup en 2 minutes, sans technique",
                ].map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: GS, border: `1px solid ${GB}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <Check size={10} color={GOLD} />
                    </div>
                    <span style={{ fontSize: 14, color: GRAY, lineHeight: 1.5, fontFamily: "var(--font-sora, system-ui)" }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section style={{ background: INK, ...px, paddingTop: 60, paddingBottom: 60 }}>
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 20 }}>
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={18} color={GOLD} fill={GOLD} />)}
            </div>
            <blockquote style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 400, color: WHITE, lineHeight: 1.5, marginBottom: 24, fontStyle: "italic" }}>
              &ldquo;En 3 mois, j&apos;ai vu mes clients habituels revenir deux fois plus souvent. La carte dans le téléphone, c&apos;est pratique pour eux et pour moi. Mes équipes adorent.&rdquo;
            </blockquote>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sora, system-ui)" }}>
              Sophie Martin · <strong style={{ color: "rgba(255,255,255,0.7)" }}>Boulangerie Martin, Lyon</strong>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ ...px, paddingTop: 72, paddingBottom: 80, textAlign: "center" }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: "clamp(26px, 3.5vw, 44px)", lineHeight: 1.2, marginBottom: 16 }}>
              Prêt à fidéliser <em style={{ fontStyle: "italic", color: GOLD }}>vos clients ?</em>
            </h2>
            <p style={{ fontSize: 16, color: GRAY, marginBottom: 32, lineHeight: 1.6 }}>
              Setup en 2 minutes · Sans carte bancaire · Essai gratuit 14 jours
            </p>
            <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 36px", background: INK, color: WHITE, borderRadius: 999, fontSize: 16, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)" }}>
              Créer ma carte boulangerie →
            </Link>
          </div>
        </section>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .commerce-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .commerce-feat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

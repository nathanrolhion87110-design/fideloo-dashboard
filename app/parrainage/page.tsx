import type { Metadata } from "next";
import Link from "next/link";
import { Gift, Users, Check, ChevronRight, Star } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://fideloo-dashboard-njfq.vercel.app";

export const metadata: Metadata = {
  title: "Programme de parrainage Fideloo — Gagnez 1 mois gratuit",
  description: "Parrainez un commerçant et gagnez 1 mois d'abonnement offert. Programme de parrainage illimité — plus vous parrainez, plus vous économisez.",
  alternates: { canonical: `${SITE_URL}/parrainage` },
  openGraph: {
    title: "Programme de parrainage Fideloo",
    description: "Recommandez Fideloo, gagnez 1 mois gratuit à chaque parrainage.",
    url: `${SITE_URL}/parrainage`,
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

export default function ParrainagePage() {
  const px = { paddingLeft: "clamp(24px, 6vw, 80px)", paddingRight: "clamp(24px, 6vw, 80px)" };

  return (
    <div style={{ background: BG, minHeight: "100vh", color: INK }}>

      {/* Navbar */}
      <header style={{ borderBottom: `1px solid ${BORD}`, background: WHITE }}>
        <div style={{ ...px, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <img src="/brand/fideloo-logo-linked.svg" alt="Fideloo" style={{ height: 30, width: "auto", display: "block" }} />
          </Link>
          <Link href="/register" style={{ padding: "9px 20px", background: INK, color: WHITE, borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)" }}>
            Créer un compte ↗
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section style={{ ...px, paddingTop: 80, paddingBottom: 80, textAlign: "center" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", background: GS, border: `1px solid ${GB}`, borderRadius: 999, marginBottom: 28 }}>
              <Gift size={14} color={GOLD} />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: GOLD, fontFamily: "var(--font-sora, system-ui)", textTransform: "uppercase" }}>Programme de parrainage</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: "clamp(34px, 5vw, 60px)", lineHeight: 1.15, marginBottom: 20 }}>
              Recommandez Fideloo,
              <em style={{ display: "block", fontStyle: "italic", color: GOLD }}>gagnez 1 mois gratuit.</em>
            </h1>
            <p style={{ fontSize: 18, color: GRAY, lineHeight: 1.7, marginBottom: 40, fontFamily: "var(--font-sora, system-ui)" }}>
              Pour chaque commerçant que vous parrainez, vous recevez 1 mois d&apos;abonnement offert. Illimité.
            </p>
            <Link href="/dashboard/parametres?tab=compte" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: INK, color: WHITE, borderRadius: 999, fontSize: 15, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)" }}>
              Obtenir mon lien de parrainage <ChevronRight size={16} />
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section style={{ ...px, paddingBottom: 80 }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: GRAY, marginBottom: 12, fontFamily: "var(--font-sora, system-ui)" }}>— COMMENT ÇA MARCHE</div>
              <h2 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.2 }}>
                Simple comme <em style={{ fontStyle: "italic" }}>un lien.</em>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="parr-steps-grid">
              {[
                { n: "01", icon: Users, title: "Partagez votre lien unique", desc: "Récupérez votre lien personnel depuis votre dashboard, dans les Paramètres → Compte. Il contient votre identifiant unique." },
                { n: "02", icon: Star, title: "Votre filleul s'inscrit", desc: "Le commerçant que vous parrainez crée son compte Fideloo via votre lien. Il bénéficie d'un essai gratuit de 14 jours." },
                { n: "03", icon: Gift, title: "Vous recevez 1 mois gratuit", desc: "Dès que votre filleul souscrit à un abonnement payant, vous recevez automatiquement 1 mois offert sur votre compte." },
              ].map(({ n, icon: Icon, title, desc }) => (
                <div key={n} style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 20, padding: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <span style={{ fontSize: 13, color: GRAY, fontWeight: 600, fontFamily: "var(--font-sora, system-ui)" }}>{n}</span>
                    <div style={{ flex: 1, height: 1, background: BORD }} />
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: GS, border: `1px solid ${GB}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={18} color={GOLD} />
                    </div>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 20, fontWeight: 600, color: INK, marginBottom: 12 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Avantages */}
        <section style={{ background: INK, ...px, paddingTop: 72, paddingBottom: 72 }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="parr-adv-grid">
              <div>
                <h2 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: "clamp(26px, 3vw, 40px)", lineHeight: 1.2, color: WHITE, marginBottom: 28 }}>
                  Des économies <em style={{ fontStyle: "italic", color: GOLD }}>sans limite.</em>
                </h2>
                <ul style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    "1 filleul = 1 mois offert",
                    "Illimité — parrainez autant que vous voulez",
                    "Crédité automatiquement sur votre compte",
                    "Valable sur tous les plans",
                    "Pas de date d'expiration sur vos mois offerts",
                  ].map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: GS, border: `1px solid ${GB}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <Check size={12} color={GOLD} />
                      </div>
                      <span style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-sora, system-ui)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ background: CARD, borderRadius: 20, padding: 36, border: `1px solid ${BORD}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: GRAY, marginBottom: 16, fontFamily: "var(--font-sora, system-ui)" }}>EXEMPLE DE GAIN</div>
                {[
                  { n: "3 filleuls", gain: "3 mois offerts", value: "150€ économisés" },
                  { n: "6 filleuls", gain: "6 mois offerts", value: "300€ économisés" },
                  { n: "12 filleuls", gain: "12 mois offerts", value: "600€ économisés" },
                ].map(({ n, gain, value }) => (
                  <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${BORD}` }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{n}</div>
                      <div style={{ fontSize: 12, color: GRAY }}>{gain}</div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: GOLD }}>{value}</div>
                  </div>
                ))}
                <div style={{ marginTop: 24 }}>
                  <Link href="/register" style={{ display: "block", textAlign: "center", padding: "13px 24px", background: INK, color: WHITE, borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)" }}>
                    Commencer à parrainer →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ ...px, paddingTop: 72, paddingBottom: 80 }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: "clamp(26px, 3vw, 40px)", lineHeight: 1.2, textAlign: "center", marginBottom: 40 }}>
              Questions <em style={{ fontStyle: "italic" }}>fréquentes.</em>
            </h2>
            {[
              { q: "Quand est crédité le mois offert ?", a: "Automatiquement dès que votre filleul souscrit à un abonnement payant. Un email de confirmation vous est envoyé." },
              { q: "Y a-t-il une limite au nombre de parrainages ?", a: "Non, aucune limite. Plus vous parrainez, plus vous gagnez de mois gratuits." },
              { q: "Le mois offert est-il valable sur tous les plans ?", a: "Oui — Standard, Pro et Business. La valeur créditée correspond au montant de votre abonnement mensuel actuel." },
              { q: "Où trouver mon lien de parrainage ?", a: "Dans votre dashboard Fideloo, section Paramètres → onglet Compte. Votre lien unique y est disponible." },
            ].map(({ q, a }) => (
              <div key={q} style={{ borderBottom: `1px solid ${BORD}`, paddingBottom: 20, marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: INK, marginBottom: 8, fontFamily: "var(--font-sora, system-ui)" }}>{q}</h3>
                <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.6 }}>{a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .parr-steps-grid { grid-template-columns: 1fr !important; }
          .parr-adv-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </div>
  );
}

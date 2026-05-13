"use client";

import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";

/* ─── Palette ──────────────────────────────────────────────────────────────── */
const BG   = "#0a0a0a";
const SURF = "#111111";
const T    = "#F5F5F5";
const TD   = "rgba(245,245,245,0.45)";
const G    = "#22C55E";
const GB   = "rgba(34,197,94,0.18)";
const BD   = "#1f1f1f";
const BDG  = "rgba(34,197,94,0.55)";

/* ─── Data ──────────────────────────────────────────────────────────────────── */
const plans = [
  {
    id: "standard",
    name: "Standard",
    price: "50",
    subtitle: "Pour un commerce indépendant qui démarre",
    cta: "Commencer gratuitement",
    ctaHref: "/register",
    ctaVariant: "outline" as const,
    highlight: false,
    features: [
      { label: "1 commerce", ok: true },
      { label: "Jusqu'à 200 clients", ok: true },
      { label: "Apple Wallet & Google Wallet", ok: true },
      { label: "QR code personnalisé", ok: true },
      { label: "Analytics de base", ok: true },
      { label: "Liste clients", ok: true },
      { label: "Support email (72h)", ok: true },
      { label: "Notifications push", ok: false },
      { label: "Export CSV", ok: false },
      { label: "Campagnes automatiques", ok: false },
      { label: "Mini-jeu avis clients", ok: false },
      { label: "Multi-commerces", ok: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "80",
    subtitle: "Pour les commerces en croissance",
    cta: "Essai gratuit 14 jours →",
    ctaHref: "/register",
    ctaVariant: "solid" as const,
    highlight: true,
    badge: "⭐ Recommandé",
    features: [
      { label: "Jusqu'à 3 commerces", ok: true },
      { label: "Jusqu'à 5 000 clients", ok: true },
      { label: "Apple Wallet & Google Wallet", ok: true },
      { label: "Analytics avancés", ok: true },
      { label: "Classement top clients", ok: true },
      { label: "Export CSV clients", ok: true },
      { label: "5 campagnes push / mois", ok: true },
      { label: "3 templates d'affiche personnalisables", ok: true },
      { label: "Gestion staff (rôles)", ok: true },
      { label: "Application mobile", ok: true },
      { label: "Support prioritaire (48h)", ok: true },
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "150",
    subtitle: "Pour les chaînes & franchises",
    cta: "Nous contacter",
    ctaHref: "mailto:contact@fideloo.fr",
    ctaVariant: "outline" as const,
    highlight: false,
    features: [
      { label: "Tout du plan Pro inclus", ok: true },
      { label: "Commerces illimités", ok: true },
      { label: "Clients illimités", ok: true },
      { label: "Analytics multi-sites consolidés", ok: true },
      { label: "Campagnes push illimitées", ok: true },
      { label: "Application mobile (Caisse & Staff)", ok: true },
      { label: "Mini-jeu pour booster les avis Google", ok: true },
      { label: "API & webhooks", ok: true },
      { label: "Account manager dédié", ok: true },
      { label: "Support prioritaire (24h)", ok: true },
    ],
  },
];

const faqs = [
  {
    q: "Puis-je tester Fideloo gratuitement ?",
    a: "Oui ! Le plan Pro inclut un essai gratuit de 14 jours sans carte bancaire. Vous pouvez créer votre carte de fidélité, scanner des clients et tester toutes les fonctionnalités immédiatement.",
  },
  {
    q: "Les cartes fonctionnent-elles sans application mobile ?",
    a: "Absolument. Vos clients ajoutent la carte directement dans Apple Wallet ou Google Wallet via un simple lien QR code. Aucune application Fideloo à télécharger côté client.",
  },
  {
    q: "Puis-je changer de plan à tout moment ?",
    a: "Oui, vous pouvez monter ou descendre en plan à tout moment depuis vos paramètres. La facturation est mensuelle, sans engagement.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Toutes les données sont stockées sur Supabase (PostgreSQL) avec des politiques RLS activées. Les communications sont chiffrées en HTTPS. Nous ne partageons jamais vos données clients.",
  },
];

/* ─── Sub-components ────────────────────────────────────────────────────────── */
function FeatureRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", gap: 10, minHeight: 28 }}>
      {ok ? (
        <span style={{ width: 18, height: 18, borderRadius: 999, background: GB, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <Check size={11} color={G} strokeWidth={3} />
        </span>
      ) : (
        <span style={{ width: 18, height: 18, borderRadius: 999, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <X size={10} color="rgba(255,255,255,0.2)" strokeWidth={2.5} />
        </span>
      )}
      <span style={{ fontSize: 14, color: ok ? T : "rgba(255,255,255,0.22)", textDecoration: ok ? "none" : "line-through", lineHeight: 1.5 }}>
        {label}
      </span>
    </li>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div style={{ borderBottom: `1px solid ${BD}`, paddingBottom: 20, paddingTop: 20 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: T, marginBottom: 8 }}>{q}</div>
      <div style={{ fontSize: 14, color: TD, lineHeight: 1.7 }}>{a}</div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", background: BG, color: T, fontFamily: "inherit" }}>

      {/* ── Header ── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10,10,10,0.85)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${BD}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: G, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#080808" }}>F</span>
            <span style={{ fontWeight: 700, fontSize: 18, color: T }}>Fideloo</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/login" style={{ fontSize: 14, color: TD, textDecoration: "none", fontWeight: 500 }}>Se connecter</Link>
            <Link href="/register" style={{ fontSize: 14, fontWeight: 600, background: G, color: "#080808", padding: "8px 18px", borderRadius: 999, textDecoration: "none" }}>
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: 64 }}>

        {/* ── Hero ── */}
        <section style={{ textAlign: "center", padding: "80px 24px 56px" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GB, border: `1px solid ${BDG}`, borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, color: G, marginBottom: 28 }}>
              Simple et transparent
            </div>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 16, letterSpacing: "-0.03em" }}>
              Un prix honnête,{" "}
              <span style={{ color: G }}>pas de surprise</span>
            </h1>
            <p style={{ fontSize: 18, color: TD, maxWidth: 480, margin: "0 auto" }}>
              Choisissez le plan qui correspond à la taille de votre commerce. Résiliable à tout moment.
            </p>
          </motion.div>
        </section>

        {/* ── Plans ── */}
        <section style={{ padding: "0 24px 96px", maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, alignItems: "start" }}>
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: plan.highlight ? SURF : "rgba(255,255,255,0.025)",
                  border: `1px solid ${plan.highlight ? BDG : BD}`,
                  borderRadius: 20,
                  padding: "36px 32px 40px",
                  position: "relative",
                  boxShadow: plan.highlight ? `0 0 0 1px ${BDG}, 0 24px 64px rgba(34,197,94,0.08)` : "none",
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: G, color: "#080808", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>
                    {plan.badge}
                  </div>
                )}

                {/* Plan name */}
                <div style={{ fontSize: 13, fontWeight: 700, color: plan.highlight ? G : TD, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
                  {plan.name}
                </div>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 72, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em", color: T }}>
                    {plan.price}€
                  </span>
                  <span style={{ fontSize: 15, color: TD, paddingBottom: 10 }}>/mois</span>
                </div>

                {/* Subtitle */}
                <p style={{ fontSize: 13, color: TD, marginBottom: 28, lineHeight: 1.5 }}>{plan.subtitle}</p>

                {/* CTA */}
                {plan.ctaVariant === "solid" ? (
                  <Link href={plan.ctaHref} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "13px 20px", background: G, color: "#080808", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none", marginBottom: 32 }}>
                    {plan.cta}
                  </Link>
                ) : (
                  <Link href={plan.ctaHref} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "13px 20px", background: "transparent", color: T, border: `1px solid rgba(255,255,255,0.15)`, borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", marginBottom: 32 }}>
                    {plan.cta}
                  </Link>
                )}

                {/* Separator */}
                <div style={{ borderTop: `1px solid ${plan.highlight ? "rgba(34,197,94,0.15)" : BD}`, marginBottom: 24 }} />

                {/* Features */}
                <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0, margin: 0 }}>
                  {plan.features.map((f) => (
                    <FeatureRow key={f.label} {...f} />
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Garanties ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ padding: "0 24px 96px", maxWidth: 1160, margin: "0 auto" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {[
              { icon: "🚫", title: "Sans engagement", desc: "Résiliez à tout moment. Pas de frais cachés ni de pénalités." },
              { icon: "⚡", title: "Opérationnel en 5 min", desc: "Créez votre carte et scannez votre premier client aujourd'hui." },
              { icon: "🔒", title: "Données sécurisées", desc: "Hébergées en Europe, chiffrées, jamais partagées avec des tiers." },
              { icon: "🎧", title: "Support réactif", desc: "Une équipe disponible par email pour vous accompagner." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${BD}`, borderRadius: 16, padding: "22px 24px" }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: TD, lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── FAQ ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ padding: "0 24px 96px", maxWidth: 700, margin: "0 auto" }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 800, color: T, marginBottom: 8, textAlign: "center", letterSpacing: "-0.02em" }}>Questions fréquentes</h2>
          <p style={{ textAlign: "center", color: TD, fontSize: 15, marginBottom: 40 }}>Tout ce qu'il faut savoir avant de se lancer.</p>
          <div>
            {faqs.map((faq) => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </motion.section>

        {/* ── CTA final ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ padding: "0 24px 120px", textAlign: "center" }}
        >
          <div style={{ maxWidth: 560, margin: "0 auto", background: SURF, border: `1px solid ${BD}`, borderRadius: 24, padding: "56px 40px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Prêt à commencer ?</div>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: T, marginBottom: 12, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              Fidélisez vos clients<br />dès aujourd'hui
            </h2>
            <p style={{ fontSize: 15, color: TD, marginBottom: 32 }}>
              14 jours d'essai gratuit. Aucune carte bancaire requise.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: G, color: "#080808", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
                Créer mon compte <ArrowRight size={16} />
              </Link>
              <Link href="/login" style={{ display: "inline-flex", alignItems: "center", padding: "14px 28px", background: "transparent", color: TD, border: `1px solid ${BD}`, borderRadius: 12, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
                Se connecter
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${BD}`, padding: "28px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 26, height: 26, borderRadius: 6, background: G, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#080808" }}>F</span>
            <span style={{ fontSize: 13, color: TD }}>Fideloo &copy; {new Date().getFullYear()}</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { label: "Accueil", href: "/" },
              { label: "Connexion", href: "/login" },
              { label: "Mentions légales", href: "/mentions-legales" },
              { label: "CGU", href: "/cgu" },
              { label: "Confidentialité", href: "/politique-confidentialite" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{ fontSize: 13, color: TD, textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

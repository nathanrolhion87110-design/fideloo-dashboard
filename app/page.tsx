"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Smartphone, QrCode, Zap, BarChart3, Palette, Bell,
  Check, ChevronDown, Sparkles, Menu, X, Lock, MessageCircle, Star,
} from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";
import GlassCard from "../components/GlassCard";
import GlowButton from "../components/GlowButton";
import GradientText from "../components/GradientText";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />
      <Navbar scrolled={scrolled} />
      <main className="pt-24">
        <Hero />
        <Marquee />
        <WhyFideloo />
        <Features />
        <Steps />
        <Pricing />
        <Faq openFaq={openFaq} setOpenFaq={setOpenFaq} />
        <FinalCTA />
        <Footer />
      </main>
      <CookieBanner />
    </div>
  );
}

/* ─── NAVBAR ───────────────────────────────────────────────────────────── */
function Navbar({ scrolled }: { scrolled: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className={["fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "py-2" : "py-4"].join(" ")}>
      <div className={["max-w-6xl mx-auto px-3 sm:px-6 transition-all rounded-2xl", scrolled ? "glass" : "bg-transparent"].join(" ")}>
        <div className="h-14 flex items-center justify-between px-3 sm:px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold pulse-glow"
              style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", color: "#080808" }}>F</div>
            <span className="font-extrabold text-lg tracking-tight" style={{ color: "#F5F0E8" }}>Fideloo</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm">
            {["Fonctionnalités", "Tarifs", "FAQ"].map((label, i) => (
              <a key={label} href={["#features", "#pricing", "#faq"][i]}
                className="transition-colors" style={{ color: "#8A8070" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#F5F0E8")}
                onMouseLeave={e => (e.currentTarget.style.color = "#8A8070")}>
                {label}
              </a>
            ))}
            <Link href="/login" className="transition-colors" style={{ color: "#8A8070" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F5F0E8")}
              onMouseLeave={e => (e.currentTarget.style.color = "#8A8070")}>
              Se connecter
            </Link>
          </nav>

          <Link href="/register" className="hidden sm:block">
            <GlowButton size="sm">Commencer <ArrowRight className="w-4 h-4" /></GlowButton>
          </Link>

          <button type="button" aria-label={mobileOpen ? "Fermer" : "Menu"}
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 rounded-lg transition-colors" style={{ color: "#F5F0E8" }}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }} className="md:hidden mx-3 mt-2 glass rounded-2xl p-3">
            <nav className="flex flex-col text-base">
              {[["#features", "Fonctionnalités"], ["#pricing", "Tarifs"], ["#faq", "FAQ"]].map(([href, label]) => (
                <a key={label} onClick={() => setMobileOpen(false)} href={href}
                  className="px-4 py-3 rounded-xl transition-colors" style={{ color: "#F5F0E8" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.05)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  {label}
                </a>
              ))}
              <Link onClick={() => setMobileOpen(false)} href="/login"
                className="px-4 py-3 rounded-xl" style={{ color: "#F5F0E8" }}>Se connecter</Link>
              <Link onClick={() => setMobileOpen(false)} href="/register" className="mt-2 mx-1">
                <GlowButton fullWidth>Commencer gratuitement <ArrowRight className="w-4 h-4" /></GlowButton>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ─── HERO ──────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="px-4 sm:px-6 max-w-6xl mx-auto pt-16 pb-24">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          {/* Badge animé */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 badge-glow"
            style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.35)", color: "#E8C87A" }}>
            <Sparkles className="w-3.5 h-3.5" />
            ✦ Nouveau — Cartes dans Apple &amp; Google Wallet
          </motion.div>

          {/* H1 */}
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .05 }}
            className="heading-display mb-6"
            style={{ fontSize: "clamp(2.25rem, 5.5vw, 4rem)", lineHeight: 1.08, color: "#F5F0E8" }}>
            La carte de fidélité que vos clients{" "}
            <GradientText>adorent utiliser</GradientText>
          </motion.h1>

          {/* Sous-titre */}
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .1 }}
            className="text-lg leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0"
            style={{ color: "#8A8070" }}>
            Fideloo transforme votre programme de fidélité en une carte numérique dans le téléphone de vos clients.{" "}
            <span style={{ color: "#F5F0E8" }}>Zéro app. Zéro friction. 100% efficace.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .15 }}
            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
            <Link href="/register">
              <GlowButton size="lg">Créer ma carte gratuite <ArrowRight className="w-4 h-4" /></GlowButton>
            </Link>
            <a href="#features">
              <GlowButton size="lg" variant="ghost">Voir comment ça marche</GlowButton>
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7, delay: .25 }}
            className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 text-sm"
            style={{ color: "#4A4540" }}>
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4" style={{ color: "#C9A84C", fill: "#C9A84C" }} />
              500+ commerces actifs
            </span>
            <span>·</span>
            <span className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" style={{ color: "#10B981" }} />
              Sans carte bancaire
            </span>
            <span>·</span>
            <span className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
              Prêt en 2 minutes
            </span>
          </motion.div>
        </div>

        {/* Mockup iPhone */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7, delay: .2 }}
          className="flex-shrink-0 relative">
          <div className="absolute inset-0 -m-16 rounded-full blur-3xl"
            style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.25), transparent 70%)" }} />
          <IPhoneMockup />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── iPhone Mockup ──────────────────────────────────────────────────────── */
function IPhoneMockup() {
  return (
    <div className="relative z-10" style={{ width: 280 }}>
      <div className="relative rounded-[3rem] overflow-hidden shadow-2xl"
        style={{
          background: "#0F0F0F",
          border: "1.5px solid rgba(201,168,76,0.15)",
          padding: "12px 8px",
          boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,76,0.06) inset, inset 0 1px 0 rgba(255,255,255,0.06)",
        }}>
        {/* Notch */}
        <div className="flex justify-center mb-3">
          <div style={{ width: 100, height: 12, background: "#000", borderRadius: 8 }} />
        </div>

        {/* Carte or */}
        <div className="rounded-[2rem] overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #C9A84C 0%, #9A7A2E 60%, #C9A84C 100%)",
            boxShadow: "0 10px 40px rgba(201,168,76,0.4)",
            padding: "24px 20px 20px",
            minHeight: 340,
          }}>
          {/* En-tête carte */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: "rgba(8,8,8,0.55)", letterSpacing: "0.1em" }}>
                CARTE FIDÉLITÉ
              </div>
              <div className="font-extrabold text-base leading-tight" style={{ color: "#080808" }}>
                Boulangerie Martin
              </div>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm"
              style={{ background: "rgba(8,8,8,0.15)", color: "#080808", backdropFilter: "blur(10px)" }}>
              B
            </div>
          </div>

          {/* Récompense */}
          <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(8,8,8,0.15)" }}>
            <div className="text-xs mb-1" style={{ color: "rgba(8,8,8,0.55)" }}>Récompense</div>
            <div className="font-bold text-sm" style={{ color: "#080808" }}>🥐 1 viennoiserie offerte</div>
          </div>

          {/* Points */}
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs mb-1" style={{ color: "rgba(8,8,8,0.55)" }}>Points</div>
              <div className="font-extrabold" style={{ fontSize: 40, color: "#080808", lineHeight: 1 }}>
                7<span style={{ fontSize: 22, color: "rgba(8,8,8,0.4)" }}>/10</span>
              </div>
              <div className="mt-2 rounded-full overflow-hidden" style={{ width: 120, height: 5, background: "rgba(8,8,8,0.2)" }}>
                <div className="h-full rounded-full" style={{ width: "70%", background: "#F5F0E8" }} />
              </div>
            </div>
            <div className="rounded-xl flex items-center justify-center"
              style={{ width: 56, height: 56, background: "#F5F0E8", padding: 5 }}>
              <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(4,1fr)", width: "100%", height: "100%" }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="rounded-sm"
                    style={{ background: [0,1,4,5,10,11,14,15,2,7,8,13].includes(i) ? "#080808" : "transparent" }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Barre du bas */}
        <div className="flex justify-center mt-3">
          <div className="rounded-full" style={{ width: 80, height: 4, background: "rgba(201,168,76,0.2)" }} />
        </div>
      </div>

      {/* Label flottant */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold glass"
        style={{ color: "#E8C87A", border: "1px solid rgba(201,168,76,0.35)" }}>
        📱 Apple Wallet · Google Wallet
      </div>
    </div>
  );
}

/* ─── MARQUEE ─────────────────────────────────────────────────────────────── */
function Marquee() {
  const items = ["Boulangerie","Restaurant","Coiffeur","Café","Pizzeria","Boutique","Épicerie","Salon de beauté","Fleuriste","Pharmacie"];
  const doubled = [...items, ...items];
  return (
    <section className="py-14 overflow-hidden"
      style={{ background: "#0F0F0F", borderTop: "1px solid rgba(201,168,76,0.06)", borderBottom: "1px solid rgba(201,168,76,0.06)" }}>
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] mb-8" style={{ color: "#4A4540" }}>
        Ils utilisent Fideloo
      </p>
      <div className="overflow-hidden">
        <div className="flex whitespace-nowrap marquee-track">
          {doubled.map((label, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-8 text-2xl font-extrabold"
              style={{ color: "rgba(201,168,76,0.1)" }}>
              {label}
              <span style={{ color: "rgba(201,168,76,0.2)" }}>·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── POURQUOI FIDELOO ────────────────────────────────────────────────────── */
function WhyFideloo() {
  const items = [
    { Icon: Smartphone, title: "Sans application", desc: "La carte s'ajoute dans Apple Wallet ou Google Wallet — déjà installés sur tous les smartphones." },
    { Icon: Lock, title: "Conforme RGPD", desc: "Données hébergées en Europe, aucun cookie de tracking, droits clients respectés." },
    { Icon: MessageCircle, title: "Support réactif", desc: "Un humain vous répond depuis le chat ou par email sous 24h." },
  ];
  return (
    <section className="px-4 sm:px-6 max-w-6xl mx-auto py-20">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <motion.div key={it.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: .5, delay: i * .07 }}>
            <GlassCard className="p-6 h-full" lift>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", boxShadow: "0 0 16px rgba(201,168,76,0.15)" }}>
                <it.Icon className="w-5 h-5" style={{ color: "#C9A84C" }} />
              </div>
              <h3 className="font-bold mb-2" style={{ color: "#F5F0E8" }}>{it.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#8A8070" }}>{it.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── FEATURES ──────────────────────────────────────────────────────────── */
const features = [
  { Icon: Smartphone, title: "Apple Wallet & Google Wallet", desc: "La carte s'ajoute en 1 tap dans le téléphone natif du client, sans app à télécharger." },
  { Icon: QrCode, title: "QR Code instantané", desc: "Affichez votre QR en caisse. Le client scanne et s'inscrit en 30 secondes." },
  { Icon: Zap, title: "Mise à jour temps réel", desc: "Ajoutez des points en 1 clic. La carte se met à jour instantanément sur le téléphone." },
  { Icon: BarChart3, title: "Analytics détaillés", desc: "Suivez vos meilleurs clients, la fréquence de visite et vos récompenses distribuées." },
  { Icon: Palette, title: "100% personnalisable", desc: "Couleurs, logo, récompenses : votre carte à votre image en quelques clics." },
  { Icon: Bell, title: "Notifications push", desc: "Envoyez des offres directement sur l'écran de verrouillage de vos clients." },
];

function Features() {
  return (
    <section id="features" className="px-4 sm:px-6 max-w-6xl mx-auto py-24">
      <div className="text-center mb-16">
        <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="heading-display text-3xl sm:text-5xl mb-4">
          <GradientText>Tout ce qu&apos;il vous faut pour fidéliser</GradientText>
        </motion.h2>
        <p className="max-w-2xl mx-auto" style={{ color: "#8A8070" }}>
          Une plateforme conçue pour les commerçants qui veulent fidéliser sans complexité technique.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: .5, delay: i * .05 }}>
            <GlassCard className="p-7 h-full" lift>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", boxShadow: "0 0 20px rgba(201,168,76,0.15)" }}>
                <f.Icon className="w-6 h-6" style={{ color: "#C9A84C" }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#F5F0E8" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#8A8070" }}>{f.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── STEPS ─────────────────────────────────────────────────────────────── */
const steps = [
  { n: "01", title: "Créez votre compte", desc: "Inscrivez-vous gratuitement avec email, Google ou Apple en moins de 30 secondes." },
  { n: "02", title: "Configurez votre carte", desc: "Choisissez votre couleur, ajoutez votre logo et définissez votre récompense." },
  { n: "03", title: "Partagez votre QR code", desc: "Affichez-le en caisse. Vos clients s'inscrivent et reçoivent leur carte instantanément." },
];

function Steps() {
  return (
    <section className="px-4 sm:px-6 max-w-6xl mx-auto py-24">
      <div className="text-center mb-16">
        <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="heading-display text-3xl sm:text-5xl mb-4">
          <GradientText>Lancez-vous en 3 minutes</GradientText>
        </motion.h2>
        <p style={{ color: "#8A8070" }}>Aucune compétence technique requise.</p>
      </div>
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
        <div aria-hidden className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)" }} />
        {steps.map((s, i) => (
          <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: .5, delay: i * .1 }}>
            <GlassCard className="p-7 text-center" lift>
              <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-xl mb-5 pulse-glow"
                style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", color: "#080808" }}>
                <GradientText as="span">{s.n}</GradientText>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#F5F0E8" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#8A8070" }}>{s.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── PRICING ───────────────────────────────────────────────────────────── */
function Pricing() {
  const handleCheckoutPro = async () => {
    const merchantStr = typeof window !== "undefined" ? localStorage.getItem("fideloo_merchant") : null;
    if (!merchantStr) { window.location.href = "/register"; return; }
    try {
      const merchant = JSON.parse(merchantStr) as { id: string };
      const token = localStorage.getItem("fideloo_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ merchantId: merchant.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Erreur Stripe");
    } catch { window.location.href = "/register"; }
  };

  return (
    <section id="pricing" className="px-4 sm:px-6 max-w-6xl mx-auto py-24">
      <div className="text-center mb-16">
        <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="heading-display text-3xl sm:text-5xl mb-4">
          <GradientText>Des tarifs simples et transparents</GradientText>
        </motion.h2>
        <p style={{ color: "#8A8070" }}>Sans engagement. Annulable à tout moment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Gratuit */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <GlassCard className="p-8 h-full flex flex-col" lift>
            <h3 className="text-lg font-bold mb-1" style={{ color: "#F5F0E8" }}>Gratuit</h3>
            <p className="text-sm mb-6" style={{ color: "#8A8070" }}>Pour démarrer votre fidélité</p>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold tracking-tight" style={{ color: "#F5F0E8" }}>0€</span>
              <span style={{ color: "#8A8070" }}>/mois</span>
            </div>
            <ul className="space-y-3 text-sm mb-8 flex-1" style={{ color: "#F5F0E8" }}>
              <Bullet>Jusqu&apos;à 50 clients</Bullet>
              <Bullet>1 commerce</Bullet>
              <Bullet>Apple Wallet &amp; Google Wallet</Bullet>
              <Bullet>QR code personnalisé</Bullet>
              <Bullet>Support email</Bullet>
            </ul>
            <Link href="/register" className="block">
              <GlowButton variant="ghost" fullWidth size="lg">Commencer gratuitement</GlowButton>
            </Link>
          </GlassCard>
        </motion.div>

        {/* Pro */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: .1 }} className="relative">
          <div className="absolute -inset-px rounded-2xl pulse-glow"
            style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)" }} aria-hidden />
          <div className="relative rounded-2xl glass-strong p-8 h-full flex flex-col"
            style={{ borderColor: "rgba(201,168,76,0.5)" }}>
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: "#C9A84C", color: "#080808" }}>
              ✦ Recommandé
            </div>
            <h3 className="text-lg font-bold mb-1" style={{ color: "#F5F0E8" }}>Pro</h3>
            <p className="text-sm mb-6" style={{ color: "#8A8070" }}>Pour scaler votre fidélité</p>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold tracking-tight">
                <GradientText>70€</GradientText>
              </span>
              <span style={{ color: "#8A8070" }}>/mois</span>
            </div>
            <ul className="space-y-3 text-sm mb-8 flex-1" style={{ color: "#F5F0E8" }}>
              <Bullet>Clients <strong>illimités</strong></Bullet>
              <Bullet>Commerces <strong>illimités</strong></Bullet>
              <Bullet>Analytics avancés</Bullet>
              <Bullet>Notifications push</Bullet>
              <Bullet>Mise à jour temps réel</Bullet>
              <Bullet>Support prioritaire</Bullet>
            </ul>
            <GlowButton fullWidth size="lg" onClick={handleCheckoutPro}>
              Passer au Pro <ArrowRight className="w-4 h-4" />
            </GlowButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <Check className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#10B981" }} />
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

/* ─── FAQ ───────────────────────────────────────────────────────────────── */
const faqs = [
  { q: "Est-ce que mes clients ont besoin d'une app ?", a: "Non. La carte s'ajoute directement dans Apple Wallet ou Google Wallet, déjà installés sur tous les smartphones." },
  { q: "Comment les clients s'inscrivent-ils ?", a: "Ils scannent votre QR code et remplissent un formulaire simple (nom + email). Ils reçoivent leur carte en moins de 30 secondes." },
  { q: "Puis-je personnaliser ma carte ?", a: "Oui : couleurs, logo, nom du commerce, image de bannière et récompense — tout est entièrement personnalisable depuis votre dashboard." },
  { q: "Comment mettre à jour les points ?", a: "Depuis votre dashboard, vous cherchez le client par nom ou email, puis vous cliquez pour ajouter des points. La carte se met à jour instantanément." },
  { q: "Y a-t-il un engagement ?", a: "Non. Le plan Pro est mensuel et annulable à tout moment depuis vos paramètres." },
];

function Faq({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (i: number | null) => void }) {
  return (
    <section id="faq" className="px-4 sm:px-6 max-w-3xl mx-auto py-24">
      <div className="text-center mb-12">
        <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="heading-display text-3xl sm:text-5xl mb-4">
          <GradientText>Questions fréquentes</GradientText>
        </motion.h2>
      </div>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <GlassCard key={i} className="overflow-hidden">
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors"
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.02)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <span className="font-semibold" style={{ color: "#F5F0E8" }}>{f.q}</span>
              <ChevronDown className={["w-5 h-5 transition-transform", openFaq === i ? "rotate-180" : ""].join(" ")}
                style={{ color: openFaq === i ? "#C9A84C" : "#8A8070" }} />
            </button>
            <AnimatePresence initial={false}>
              {openFaq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }}>
                  <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "#8A8070" }}>{f.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

/* ─── CTA FINAL ─────────────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="px-4 sm:px-6 max-w-6xl mx-auto py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative rounded-[2rem] overflow-hidden p-10 sm:p-16 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(232,112,90,0.1) 100%), #141414",
          border: "1px solid rgba(201,168,76,0.3)",
          boxShadow: "0 50px 100px rgba(201,168,76,0.1)",
        }}>
        <div aria-hidden className="absolute inset-0 -z-10"
          style={{ background: "radial-gradient(ellipse at top, rgba(201,168,76,0.2), transparent 60%)" }} />
        <h2 className="heading-display text-3xl sm:text-5xl mb-4" style={{ color: "#F5F0E8" }}>
          Prêt à fidéliser vos clients ?
        </h2>
        <p className="max-w-xl mx-auto mb-8" style={{ color: "#8A8070" }}>
          Rejoignez les 500+ commerces qui modernisent leur fidélité avec Fideloo. Gratuit pour démarrer.
        </p>
        <Link href="/register">
          <GlowButton size="lg">Créer mon compte gratuitement <ArrowRight className="w-4 h-4" /></GlowButton>
        </Link>
      </motion.div>
    </section>
  );
}

/* ─── FOOTER ────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="px-4 sm:px-6 max-w-6xl mx-auto pb-12 pt-6">
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
        style={{ borderTop: "1px solid rgba(201,168,76,0.08)", color: "#4A4540" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center font-extrabold text-sm"
            style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", color: "#080808" }}>F</div>
          <span className="font-semibold" style={{ color: "#F5F0E8" }}>Fideloo</span>
          <span>· © {new Date().getFullYear()}</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {[["/mentions-legales","Mentions légales"],["/politique-confidentialite","Politique de confidentialité"],["/cgu","CGU"]].map(([href, label]) => (
            <Link key={href} href={href} className="transition-colors"
              onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
              onMouseLeave={e => (e.currentTarget.style.color = "#4A4540")}>
              {label}
            </Link>
          ))}
          <a href="mailto:contact@fideloo.fr" className="transition-colors"
            onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
            onMouseLeave={e => (e.currentTarget.style.color = "#4A4540")}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ─── Cookie Banner ──────────────────────────────────────────────────────── */
function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!localStorage.getItem("fideloo_cookie_ok")) setShow(true); }, []);
  const accept = () => { localStorage.setItem("fideloo_cookie_ok", "1"); setShow(false); };
  if (!show) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] p-3 sm:p-4">
      <div className="glass-strong max-w-3xl mx-auto rounded-2xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <p className="text-sm flex-1" style={{ color: "#8A8070" }}>
          Nous utilisons uniquement des cookies fonctionnels essentiels au service.{" "}
          <Link href="/politique-confidentialite" className="underline" style={{ color: "#C9A84C" }}>En savoir plus</Link>
        </p>
        <GlowButton size="sm" onClick={accept}>J&apos;accepte</GlowButton>
      </div>
    </div>
  );
}

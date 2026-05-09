"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Smartphone, QrCode, Zap, BarChart3, Palette, Bell,
  Check, ChevronDown, Sparkles, Menu, X
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
        <Features />
        <Steps />
        <Pricing />
        <Faq openFaq={openFaq} setOpenFaq={setOpenFaq} />
        <FinalCTA />
        <Footer />
      </main>
    </div>
  );
}

/* ─── NAVBAR ───────────────────────────────────────────────────────────── */
function Navbar({ scrolled }: { scrolled: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4",
      ].join(" ")}
    >
      <div className={["max-w-6xl mx-auto px-3 sm:px-6 transition-all rounded-2xl",
        scrolled ? "glass" : "bg-transparent"].join(" ")}>
        <div className="h-14 flex items-center justify-between px-3 sm:px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold pulse-glow"
                 style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}>F</div>
            <span className="font-extrabold text-lg tracking-tight text-text-main">Fideloo</span>
          </Link>

          {/* Liens desktop */}
          <nav className="hidden md:flex items-center gap-7 text-sm">
            <a href="#features" className="text-text-muted hover:text-text-main transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="text-text-muted hover:text-text-main transition-colors">Tarifs</a>
            <a href="#faq" className="text-text-muted hover:text-text-main transition-colors">FAQ</a>
            <Link href="/login" className="text-text-muted hover:text-text-main transition-colors">Se connecter</Link>
          </nav>

          {/* CTA desktop */}
          <Link href="/register" className="hidden sm:block">
            <GlowButton size="sm">
              Commencer <ArrowRight className="w-4 h-4" />
            </GlowButton>
          </Link>

          {/* Burger mobile */}
          <button
            type="button"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-text-main hover:bg-white/5 transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mx-3 mt-2 glass rounded-2xl p-3"
          >
            <nav className="flex flex-col text-base">
              <a onClick={() => setMobileOpen(false)} href="#features"
                className="px-4 py-3 rounded-xl text-text-main hover:bg-white/5">Fonctionnalités</a>
              <a onClick={() => setMobileOpen(false)} href="#pricing"
                className="px-4 py-3 rounded-xl text-text-main hover:bg-white/5">Tarifs</a>
              <a onClick={() => setMobileOpen(false)} href="#faq"
                className="px-4 py-3 rounded-xl text-text-main hover:bg-white/5">FAQ</a>
              <Link onClick={() => setMobileOpen(false)} href="/login"
                className="px-4 py-3 rounded-xl text-text-main hover:bg-white/5">Se connecter</Link>
              <Link onClick={() => setMobileOpen(false)} href="/register"
                className="mt-2 mx-1">
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
    <section className="px-4 sm:px-6 max-w-6xl mx-auto pt-12 pb-24 text-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
        style={{
          background: "rgba(124,58,237,0.12)",
          border: "1px solid rgba(124,58,237,0.3)",
          color: "#A78BFA"
        }}>
        <Sparkles className="w-3.5 h-3.5" />
        La carte de fidélité du futur
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .05 }}
        className="heading-display text-[2rem] leading-[1.1] sm:text-5xl lg:text-7xl mb-6 max-w-4xl mx-auto break-words">
        Fidélisez vos clients avec une <GradientText>carte qui s&apos;ajoute</GradientText> dans leur téléphone
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .1 }}
        className="text-lg text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
        Fideloo permet à votre commerce de créer une carte de fidélité numérique qui s&apos;ajoute directement dans
        Apple Wallet et Google Wallet. <span className="text-text-main">Sans app, sans friction.</span>
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .15 }}
        className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
        <Link href="/register">
          <GlowButton size="lg">
            Commencer gratuitement <ArrowRight className="w-4 h-4" />
          </GlowButton>
        </Link>
        <a href="#features">
          <GlowButton size="lg" variant="ghost">Voir les fonctionnalités</GlowButton>
        </a>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8, delay: .25 }}
        className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-text-muted mb-16">
        <span className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Sans application</span>
        <span className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Apple & Google Wallet</span>
        <span className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Mise à jour temps réel</span>
        <span className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Sans engagement</span>
      </motion.div>

      <WalletMockup />
    </section>
  );
}

/* ─── Mockup carte Wallet ──────────────────────────────────────────────── */
function WalletMockup() {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .3 }}
      className="relative max-w-md mx-auto">
      <div className="absolute inset-0 -m-12 rounded-[3rem] blur-3xl"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.35), transparent 70%)" }} />
      <div className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
          boxShadow: "0 40px 80px rgba(124,58,237,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset"
        }}>
        <div className="p-6 text-white">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="text-xs opacity-70 uppercase tracking-wider">Carte fidélité</div>
              <div className="font-extrabold text-xl mt-1">Boulangerie Dubois</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-bold">
              D
            </div>
          </div>
          <div className="mb-8">
            <div className="text-xs opacity-70 mb-1">Récompense</div>
            <div className="font-bold">1 viennoiserie offerte</div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs opacity-70 mb-1">Points</div>
              <div className="text-4xl font-extrabold">7/10</div>
            </div>
            <div className="w-20 h-20 rounded bg-white p-2 flex items-center justify-center">
              <div className="w-full h-full grid grid-cols-3 gap-0.5" aria-hidden>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-black rounded-sm" style={{ opacity: (i % 3 === 1) ? 0.2 : 1 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-3" style={{ background: "rgba(0,0,0,0.2)" }}>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold">Apple Wallet</span>
            <span className="opacity-50">·</span>
            <span className="opacity-70">Touchez pour ouvrir</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── FEATURES ─────────────────────────────────────────────────────────── */
const features = [
  { Icon: Smartphone, title: "Apple Wallet & Google Wallet",
    desc: "La carte s'ajoute directement dans le téléphone du client, sans app à télécharger." },
  { Icon: QrCode, title: "QR Code intelligent",
    desc: "Affichez votre QR code en caisse. Le client scanne et s'inscrit en 30 secondes." },
  { Icon: Zap, title: "Mise à jour en temps réel",
    desc: "Ajoutez des points depuis votre dashboard, la carte du client se met à jour instantanément." },
  { Icon: BarChart3, title: "Analytics complets",
    desc: "Suivez vos clients fidèles, leur fréquence de visite et vos récompenses distribuées." },
  { Icon: Palette, title: "Personnalisable",
    desc: "Choisissez les couleurs de votre carte, votre logo et vos récompenses." },
  { Icon: Bell, title: "Notifications push",
    desc: "Envoyez des offres directement sur l'écran de verrouillage de vos clients." },
];

function Features() {
  return (
    <section id="features" className="px-4 sm:px-6 max-w-6xl mx-auto py-24">
      <div className="text-center mb-16">
        <h2 className="heading-display text-3xl sm:text-5xl mb-4">
          <GradientText>Tout ce dont votre commerce a besoin</GradientText>
        </h2>
        <p className="text-text-muted max-w-2xl mx-auto">
          Une plateforme conçue pour les commerçants qui veulent fidéliser sans complexité technique.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div key={f.title}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: .5, delay: i * .05 }}>
            <GlassCard className="p-7 h-full" lift>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(37,99,235,0.18))",
                  border: "1px solid rgba(124,58,237,0.35)",
                  boxShadow: "0 0 20px rgba(124,58,237,0.25)"
                }}>
                <f.Icon className="w-6 h-6" style={{ color: "#A78BFA" }} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-text-main">{f.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{f.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── STEPS ────────────────────────────────────────────────────────────── */
const steps = [
  { n: "01", title: "Créez votre compte",
    desc: "Inscrivez-vous gratuitement avec votre email, Google ou Apple en moins de 30 secondes." },
  { n: "02", title: "Configurez votre carte",
    desc: "Choisissez votre couleur, ajoutez votre logo et définissez votre récompense." },
  { n: "03", title: "Partagez votre QR code",
    desc: "Affichez-le en caisse. Vos clients s'inscrivent et reçoivent leur carte instantanément." },
];

function Steps() {
  return (
    <section className="px-4 sm:px-6 max-w-6xl mx-auto py-24">
      <div className="text-center mb-16">
        <h2 className="heading-display text-3xl sm:text-5xl mb-4">
          <GradientText>Lancez-vous en 3 minutes</GradientText>
        </h2>
        <p className="text-text-muted">Aucune compétence technique requise.</p>
      </div>
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
        <div aria-hidden className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)" }} />
        {steps.map((s, i) => (
          <motion.div key={s.n}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: .5, delay: i * .1 }}
            className="relative">
            <GlassCard className="p-7 text-center" lift>
              <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl mb-5 pulse-glow"
                style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}>
                {s.n}
              </div>
              <h3 className="text-lg font-bold mb-2 text-text-main">{s.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{s.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── PRICING ──────────────────────────────────────────────────────────── */
function Pricing() {
  const handleCheckoutPro = async () => {
    const merchantStr = typeof window !== "undefined" ? localStorage.getItem("fideloo_merchant") : null;
    if (!merchantStr) { window.location.href = "/register"; return; }
    try {
      const merchant = JSON.parse(merchantStr) as { id: string };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("fideloo_token");
      const res = await fetch(`${apiUrl}/stripe/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ merchantId: merchant.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Erreur lors de la création de la session Stripe");
    } catch (e) {
      console.error(e);
      window.location.href = "/register";
    }
  };

  return (
    <section id="pricing" className="px-4 sm:px-6 max-w-6xl mx-auto py-24">
      <div className="text-center mb-16">
        <h2 className="heading-display text-3xl sm:text-5xl mb-4">
          <GradientText>Des tarifs simples et transparents</GradientText>
        </h2>
        <p className="text-text-muted">Sans engagement. Annulable à tout moment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Plan Gratuit */}
        <GlassCard className="p-8" lift>
          <h3 className="text-lg font-bold text-text-main mb-1">Gratuit</h3>
          <p className="text-sm text-text-muted mb-6">Pour démarrer votre fidélité</p>
          <div className="mb-6 flex items-baseline gap-1">
            <span className="text-5xl font-extrabold tracking-tight text-text-main">0€</span>
            <span className="text-text-muted">/mois</span>
          </div>
          <ul className="space-y-3 text-sm text-text-main mb-8">
            <Bullet>Jusqu&apos;à 50 clients</Bullet>
            <Bullet>1 commerce</Bullet>
            <Bullet>Apple Wallet & Google Wallet</Bullet>
            <Bullet>QR code personnalisé</Bullet>
            <Bullet>Support email</Bullet>
          </ul>
          <Link href="/register" className="block">
            <GlowButton variant="ghost" fullWidth size="lg">Commencer gratuitement</GlowButton>
          </Link>
        </GlassCard>

        {/* Plan Pro */}
        <div className="relative">
          <div className="absolute -inset-px rounded-2xl pulse-glow"
            style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }} aria-hidden />
          <div className="relative rounded-2xl glass-strong p-8" style={{ borderColor: "rgba(124,58,237,0.5)" }}>
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}>
              Populaire
            </div>
            <h3 className="text-lg font-bold text-text-main mb-1">Pro</h3>
            <p className="text-sm text-text-muted mb-6">Pour scaler votre fidélité</p>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold tracking-tight"><GradientText>70€</GradientText></span>
              <span className="text-text-muted">/mois</span>
            </div>
            <ul className="space-y-3 text-sm text-text-main mb-8">
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
        </div>
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <Check className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#34D399" }} />
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────────────────── */
const faqs = [
  { q: "Est-ce que mes clients ont besoin d'une app ?",
    a: "Non. La carte s'ajoute directement dans Apple Wallet ou Google Wallet, déjà installés sur tous les smartphones." },
  { q: "Comment les clients s'inscrivent-ils ?",
    a: "Ils scannent votre QR code et remplissent un formulaire simple (nom + email). Ils reçoivent leur carte en moins de 30 secondes." },
  { q: "Puis-je personnaliser ma carte ?",
    a: "Oui : couleurs, logo, nom du commerce, image de bannière et récompense — tout est entièrement personnalisable depuis votre dashboard." },
  { q: "Comment mettre à jour les points ?",
    a: "Depuis votre dashboard, vous cherchez le client par nom ou email, puis vous cliquez pour ajouter des points. La carte du client se met à jour instantanément sur son téléphone." },
  { q: "Y a-t-il un engagement ?",
    a: "Non. Le plan Pro est mensuel et annulable à tout moment depuis vos paramètres." },
];

function Faq({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (i: number | null) => void }) {
  return (
    <section id="faq" className="px-4 sm:px-6 max-w-3xl mx-auto py-24">
      <div className="text-center mb-12">
        <h2 className="heading-display text-3xl sm:text-5xl mb-4">
          <GradientText>Questions fréquentes</GradientText>
        </h2>
      </div>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <GlassCard key={i} className="overflow-hidden">
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-white/[0.03]">
              <span className="font-semibold text-text-main">{f.q}</span>
              <ChevronDown
                className={["w-5 h-5 transition-transform", openFaq === i ? "rotate-180 text-[#A78BFA]" : "text-text-muted"].join(" ")}
              />
            </button>
            <AnimatePresence initial={false}>
              {openFaq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }}>
                  <div className="px-6 pb-5 text-sm text-text-muted leading-relaxed">{f.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

/* ─── CTA FINAL ────────────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="px-4 sm:px-6 max-w-6xl mx-auto py-24">
      <div className="relative rounded-[2rem] overflow-hidden p-10 sm:p-16 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.4) 0%, rgba(37,99,235,0.3) 100%), #16161F",
          border: "1px solid rgba(124,58,237,0.4)",
          boxShadow: "0 50px 100px rgba(124,58,237,0.3)"
        }}>
        <div aria-hidden className="absolute inset-0 -z-10"
          style={{ background: "radial-gradient(ellipse at top, rgba(124,58,237,0.4), transparent 60%)" }} />
        <h2 className="heading-display text-3xl sm:text-5xl mb-4 text-text-main">
          Prêt à fidéliser vos clients ?
        </h2>
        <p className="text-text-muted max-w-xl mx-auto mb-8">
          Rejoignez les commerces qui modernisent leur fidélité avec Fideloo. Gratuit pour démarrer.
        </p>
        <Link href="/register">
          <GlowButton size="lg">
            Créer mon compte gratuitement <ArrowRight className="w-4 h-4" />
          </GlowButton>
        </Link>
      </div>
    </section>
  );
}

/* ─── FOOTER ───────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="px-4 sm:px-6 max-w-6xl mx-auto pb-12 pt-6">
      <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-extrabold text-sm"
            style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}>F</div>
          <span className="font-semibold text-text-main">Fideloo</span>
          <span>· © {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-text-main transition-colors">Mentions légales</a>
          <a href="#" className="hover:text-text-main transition-colors">Confidentialité</a>
          <a href="mailto:contact@fideloo.app" className="hover:text-text-main transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, HelpCircle, Zap, Shield, HeadphonesIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    question: "Puis-je tester Fideloo gratuitement ?",
    answer:
      "Oui ! Le plan Gratuit est disponible sans limite de temps et sans carte bancaire. Vous pouvez créer votre carte de fidélité, scanner des clients et suivre vos statistiques immédiatement.",
  },
  {
    question: "Quand dois-je passer au plan Pro ?",
    answer:
      "Le plan Pro est idéal dès que vous dépassez 50 clients actifs ou souhaitez accéder aux campagnes de notifications, à l'export CSV illimité et à l'intégration Apple/Google Wallet complète avec mises à jour en temps réel.",
  },
  {
    question: "Les cartes fonctionnent-elles sans application mobile ?",
    answer:
      "Absolument. Vos clients ajoutent la carte directement dans Apple Wallet ou Google Wallet via un simple lien QR code. Aucune application Fideloo à télécharger côté client.",
  },
  {
    question: "Puis-je changer de plan à tout moment ?",
    answer:
      "Oui, vous pouvez passer au Pro ou revenir au Gratuit à tout moment depuis vos paramètres. La facturation est mensuelle, sans engagement.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Toutes les données sont stockées sur Supabase (PostgreSQL) avec des politiques RLS activées. Les communications sont chiffrées en HTTPS. Nous ne partageons jamais vos données clients avec des tiers.",
  },
  {
    question: "Comment fonctionne le support ?",
    answer:
      "Le plan Gratuit bénéficie du support par email. Le plan Pro inclut un support prioritaire avec une réponse sous 24h ouvrées.",
  },
];

const freeFeatures = [
  "Jusqu'à 50 clients",
  "1 carte de fidélité personnalisée",
  "Couleur et logo de votre commerce",
  "Scanner QR code intégré",
  "Dashboard statistiques",
  "QR code d'inscription client",
  "Support par email",
];

const proFeatures = [
  "Clients illimités",
  "Tout le plan Gratuit",
  "Apple Wallet & Google Wallet (temps réel)",
  "Notifications push clients",
  "Export CSV illimité",
  "Image bannière personnalisée",
  "Connexion Google OAuth",
  "Email de bienvenue automatique",
  "Support prioritaire (< 24h)",
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-text-main">{question}</span>
        <HelpCircle
          className={`w-5 h-5 text-primary flex-shrink-0 ml-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-text-muted text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background-main/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
              F
            </div>
            <span className="font-bold text-xl tracking-tight text-text-main">Fideloo</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">
              Se connecter
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-all shadow-sm"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16">
        {/* Hero */}
        <section className="pt-20 pb-16 px-4 sm:px-6 text-center bg-gradient-to-b from-indigo-50 to-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Simple et transparent
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-main mb-4">
              Un prix honnête,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                pas de surprise
              </span>
            </h1>
            <p className="text-lg text-text-muted max-w-xl mx-auto">
              Commencez gratuitement, passez au Pro quand votre commerce grandit.
            </p>
          </motion.div>
        </section>

        {/* Plans */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
            {/* Plan Gratuit */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"
            >
              <div className="mb-6">
                <p className="text-sm font-medium text-text-muted uppercase tracking-wider mb-2">Gratuit</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-text-main">0€</span>
                  <span className="text-text-muted">/mois</span>
                </div>
                <p className="text-sm text-text-muted mt-2">Pour démarrer sans risque</p>
              </div>

              <Link
                href="/register"
                className="block w-full text-center py-3 px-6 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary/5 transition-colors mb-8"
              >
                Commencer gratuitement
              </Link>

              <ul className="space-y-3">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Plan Pro */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-primary rounded-2xl p-8 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                Populaire
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-white/70 uppercase tracking-wider mb-2">Pro</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">70€</span>
                  <span className="text-white/70">/mois</span>
                </div>
                <p className="text-sm text-white/70 mt-2">Pour développer votre clientèle</p>
              </div>

              <Link
                href="/register"
                className="group flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-white text-primary font-medium hover:bg-white/95 transition-colors mb-8"
              >
                Démarrer l'essai gratuit
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <ul className="space-y-3">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/90">
                    <Check className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Garanties */}
        <section className="py-12 px-4 sm:px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Sans engagement",
                  desc: "Annulez à tout moment. Pas de frais cachés.",
                },
                {
                  icon: Zap,
                  title: "Opérationnel en 5 min",
                  desc: "Créez votre carte et scannez votre premier client dès aujourd'hui.",
                },
                {
                  icon: HeadphonesIcon,
                  title: "Support réactif",
                  desc: "Une équipe disponible par email pour vous accompagner.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 bg-white rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-text-main text-sm mb-1">{title}</p>
                    <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-text-main text-center mb-10">
              Questions fréquentes
            </h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <FaqItem key={faq.question} {...faq} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-16 px-4 sm:px-6 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-text-main mb-4">
              Prêt à fidéliser vos clients ?
            </h2>
            <p className="text-text-muted mb-8">
              Rejoignez les commerçants qui utilisent Fideloo pour créer du lien avec leur clientèle.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
            >
              Créer mon compte gratuitement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white font-bold text-sm">
              F
            </div>
            <span>Fideloo &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-text-main transition-colors">Accueil</Link>
            <Link href="/login" className="hover:text-text-main transition-colors">Connexion</Link>
            <Link href="/register" className="hover:text-text-main transition-colors">Inscription</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

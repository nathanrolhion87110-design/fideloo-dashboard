"use client";

import { motion } from "framer-motion";
import { ArrowRight, QrCode, Gift, Wallet, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background-main/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
              F
            </div>
            <span className="font-bold text-xl tracking-tight text-text-main">Fideloo</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">
              Se connecter
            </Link>
            <Link href="/register" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-all shadow-sm">
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white -z-10" />
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-text-main mb-6">
                La carte de fidélité <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">digitale</span> pour votre commerce
              </h1>
              <p className="text-xl text-text-muted max-w-2xl mx-auto mb-10">
                Fidélisez vos clients avec une carte qui s'ajoute directement dans Apple Wallet et Google Wallet. Sans application à télécharger.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register" className="group flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#comment-ca-marche" className="text-text-muted font-medium px-8 py-4 rounded-full hover:bg-slate-100 transition-colors">
                  Comment ça marche ?
                </Link>
              </div>
            </motion.div>

            {/* Wallet Mockups Illustration */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-20 relative max-w-3xl mx-auto"
            >
              <div className="aspect-[16/9] bg-slate-900 rounded-3xl shadow-2xl border-4 border-slate-800 overflow-hidden relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-sidebar to-slate-800 opacity-50" />
                {/* Mockup d'une carte Apple Wallet */}
                <div className="relative z-10 w-72 h-44 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl flex flex-col p-4 text-white transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-lg">Mon Commerce</div>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <QrCode className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-auto flex justify-between items-end">
                    <div>
                      <div className="text-sm opacity-80">Points</div>
                      <div className="text-3xl font-bold">8/10</div>
                    </div>
                    <div className="text-2xl">☕</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section id="comment-ca-marche" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-text-main mb-4">Un parcours sans friction</h2>
              <p className="text-lg text-text-muted max-w-2xl mx-auto">
                De l'inscription de votre commerce à la récompense de vos clients, tout est pensé pour être simple et rapide.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  icon: QrCode,
                  title: "1. Le client scanne",
                  description: "Affichez votre QR code en caisse. Vos clients le scannent en une seconde."
                },
                {
                  icon: Wallet,
                  title: "2. Ajout au Wallet",
                  description: "La carte s'ajoute directement dans Apple Wallet ou Google Wallet, sans application."
                },
                {
                  icon: Gift,
                  title: "3. Cumul de points",
                  description: "À chaque visite, scannez leur carte pour ajouter des points jusqu'à la récompense."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 text-primary">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-text-main mb-3">{step.title}</h3>
                  <p className="text-text-muted leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features & Trust */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-text-main mb-6">Pourquoi choisir Fideloo ?</h2>
              <ul className="space-y-6">
                {[
                  "100% en français et adapté aux commerces locaux",
                  "Aucune application à faire télécharger à vos clients",
                  "Notifications push pour relancer vos clients inactifs",
                  "Analytiques détaillées de votre clientèle",
                ].map((feature, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-lg text-text-muted"
                  >
                    <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[3rem] transform rotate-3 scale-105" />
               <div className="relative bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden">
                         <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-text-main">Marie L.</div>
                        <div className="text-sm text-text-muted">Gérante de Boulangerie</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-text-main italic text-lg leading-relaxed">
                    "Fideloo a complètement changé notre approche. Avant, nos clients perdaient leurs cartes papier. Maintenant, ils l'ont tous dans leur téléphone. Nos visites ont augmenté de 20% en 3 mois."
                  </p>
               </div>
            </div>
          </div>
        </section>

        {/* Pricing CTA */}
        <section className="py-24 bg-white text-center">
           <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
             <h2 className="text-4xl font-bold text-text-main mb-6">Prêt à digitaliser votre fidélité ?</h2>
             <p className="text-xl text-text-muted mb-10">
               Rejoignez les commerçants qui ont déjà modernisé leur relation client.
             </p>
             <Link href="/register" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-primary/90 transition-all shadow-lg hover:-translate-y-0.5">
                Créer ma carte de fidélité
                <ArrowRight className="w-5 h-5" />
             </Link>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white font-bold text-sm">
              F
            </div>
            <span className="font-bold text-text-main">Fideloo</span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Fideloo. Tous droits réservés.
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-primary transition-colors">Mentions légales</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

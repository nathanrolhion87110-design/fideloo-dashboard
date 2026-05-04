"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-indigo-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-3xl mx-auto mb-8 shadow-lg">
          F
        </div>

        {/* 404 */}
        <p className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 leading-none">
          404
        </p>

        <h1 className="text-2xl font-bold text-text-main mb-3">
          Page introuvable
        </h1>
        <p className="text-text-muted mb-10 leading-relaxed">
          Oops ! La page que vous cherchez n&apos;existe pas ou a été déplacée.
          <br />
          Vérifiez l&apos;adresse ou revenez à l&apos;accueil.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-text-muted hover:bg-slate-50 hover:text-text-main transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors font-medium shadow-sm"
          >
            <Home className="w-4 h-4" />
            Accueil
          </Link>
        </div>
      </motion.div>

      {/* Fond décoratif */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />
      </div>
    </div>
  );
}

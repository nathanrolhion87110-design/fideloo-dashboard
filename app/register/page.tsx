"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, Store, Tag } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("restaurant");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await api.post("/merchants/register", {
        email,
        password,
        business_name: businessName,
        business_type: businessType
      });
      
      login(response.data.token, response.data.merchant);
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.response?.data?.error || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-main py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100 my-8"
      >
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl mb-6">
            F
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-text-main">
            Créer un compte
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Lancez votre programme de fidélité en 2 minutes
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-text-main">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continuer avec Google
          </button>
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white rounded-xl hover:bg-black/90 transition-colors font-medium">
             <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="fill-white"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>
            Continuer avec Apple
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-text-muted">ou</span>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-4 text-sm text-error bg-error/10 rounded-xl border border-error/20">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Nom du commerce</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Store className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-text-main shadow-sm focus:border-primary focus:ring-primary focus:bg-white transition-colors"
                  placeholder="Ex: Boulangerie Dubois"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Type de commerce</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-text-main shadow-sm focus:border-primary focus:ring-primary focus:bg-white transition-colors appearance-none"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="boulangerie">Boulangerie</option>
                  <option value="coiffeur">Coiffeur</option>
                  <option value="cafe">Café</option>
                  <option value="boutique">Boutique</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-text-main shadow-sm focus:border-primary focus:ring-primary focus:bg-white transition-colors"
                  placeholder="vous@commerce.fr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-text-main shadow-sm focus:border-primary focus:ring-primary focus:bg-white transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer mon compte"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary/80">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Store, CreditCard, Palette, Shield, Save, Upload, CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import GlassCard from "../../../components/GlassCard";
import GlowButton from "../../../components/GlowButton";
import GradientText from "../../../components/GradientText";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface PlanStatus { plan: "free" | "pro"; plan_expires_at: string | null; has_stripe_customer: boolean; }

interface MerchantUpdate {
  business_name?: string; business_type?: string;
  primary_color?: string; reward_threshold?: number; reward_description?: string;
  logo_url?: string; strip_url?: string;
}

export default function SettingsPageWrapper() {
  return (
    <Suspense fallback={<div className="text-text-muted">Chargement…</div>}>
      <SettingsPage />
    </Suspense>
  );
}

function SettingsPage() {
  const { merchant, updateMerchant } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("commerce");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [planStatus, setPlanStatus] = useState<PlanStatus | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Si on revient de Stripe avec ?upgraded=true → ouvrir l'onglet abonnement + message
  useEffect(() => {
    if (searchParams?.get("upgraded") === "true") {
      setActiveTab("abonnement");
      setSuccessMsg("🎉 Bienvenue sur le plan Pro ! Votre abonnement est actif.");
      setTimeout(() => setSuccessMsg(""), 6000);
    }
  }, [searchParams]);

  // Charger le statut Stripe
  useEffect(() => {
    if (!merchant) return;
    api.get<PlanStatus>(`/stripe/status/${merchant.id}`)
      .then((r) => setPlanStatus(r.data))
      .catch(() => setPlanStatus({ plan: "free", plan_expires_at: null, has_stripe_customer: false }));
  }, [merchant]);

  const handleUpgrade = async () => {
    if (!merchant) return;
    setCheckoutLoading(true);
    try {
      const res = await api.post<{ url?: string; error?: string }>("/stripe/create-checkout", { merchantId: merchant.id });
      if (res.data.url) window.location.href = res.data.url;
      else alert(res.data.error || "Impossible de démarrer le paiement");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      alert(err.response?.data?.error || "Erreur Stripe");
    } finally { setCheckoutLoading(false); }
  };

  const handleManageSubscription = async () => {
    try {
      const res = await api.post<{ url?: string }>("/stripe/portal");
      if (res.data.url) window.location.href = res.data.url;
    } catch (e) { console.error(e); alert("Impossible d'ouvrir le portail Stripe."); }
  };

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("restaurant");
  const [color, setColor] = useState("#7C3AED");
  const [threshold, setThreshold] = useState(10);
  const [rewardDesc, setRewardDesc] = useState("");

  const logoRef = useRef<HTMLInputElement>(null);
  const stripRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!merchant) return;
    setBusinessName(merchant.business_name || "");
    setBusinessType((merchant.business_type as string) || "restaurant");
    setColor(merchant.primary_color || "#7C3AED");
    setThreshold(merchant.reward_threshold || 10);
    setRewardDesc(merchant.reward_description || "");
  }, [merchant]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3000);
  };

  const saveCommerce = async () => {
    if (!merchant) return;
    setSaving(true);
    try {
      const res = await api.put(`/merchants/${merchant.id}`, { business_name: businessName, business_type: businessType });
      updateMerchant(res.data);
      showSuccess("Informations du commerce enregistrées !");
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const saveCarte = async () => {
    if (!merchant) return;
    setSaving(true);
    try {
      const res = await api.put(`/merchants/${merchant.id}`, {
        primary_color: color, reward_threshold: threshold, reward_description: rewardDesc
      });
      updateMerchant(res.data);
      showSuccess("Carte mise à jour !");
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const uploadFile = async (file: File, type: "logo" | "strip") => {
    if (!merchant) return;
    setUploading(true);
    const formData = new FormData(); formData.append("file", file);
    try {
      const token = localStorage.getItem("fideloo_token");
      const res = await fetch(`${API_URL}/merchants/${merchant.id}/upload?type=${type}`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData,
      });
      const data = await res.json();
      if (data.url) {
        const update: MerchantUpdate = type === "logo" ? { logo_url: data.url } : { strip_url: data.url };
        updateMerchant(update);
        showSuccess("Image uploadée avec succès !");
      } else { alert(data.error || "Erreur lors de l'upload"); }
    } catch (e) { console.error(e); }
    finally { setUploading(false); }
  };

  const tabs = [
    { id: "commerce", label: "Commerce", icon: Store },
    { id: "carte", label: "Carte Wallet", icon: Palette },
    { id: "compte", label: "Compte", icon: Shield },
    { id: "abonnement", label: "Abonnement", icon: CreditCard },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 fade-in-up">
      <div>
        <h1 className="heading-display text-3xl"><GradientText>Paramètres</GradientText></h1>
        <p className="text-text-muted mt-1">Gérez votre commerce et votre abonnement</p>
      </div>

      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
          style={{ background: "rgba(16,185,129,0.12)", color: "#34D399", border: "1px solid rgba(16,185,129,0.3)" }}>
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </motion.div>
      )}

      <GlassCard className="overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        <div className="w-full md:w-64 p-4" style={{ background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={[
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === t.id ? "nav-active" : "text-text-muted hover:text-white hover:bg-white/5"
                ].join(" ")}>
                <t.icon className={`w-5 h-5 ${activeTab === t.id ? "" : "opacity-70"}`} />
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 p-6 md:p-8">
          {activeTab === "commerce" && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-lg font-bold text-text-main">Informations du commerce</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Nom du commerce</label>
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                    className="input-dark w-full rounded-xl py-3 px-4 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Type de commerce</label>
                  <select value={businessType} onChange={(e) => setBusinessType(e.target.value)}
                    className="input-dark w-full rounded-xl py-3 px-4 text-sm appearance-none">
                    <option value="restaurant">Restaurant</option>
                    <option value="boulangerie">Boulangerie</option>
                    <option value="boutique">Boutique</option>
                    <option value="coiffeur">Coiffeur</option>
                    <option value="cafe">Café</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Logo du commerce</label>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
                         style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)" }}>
                      {merchant?.logo_url ? (
                        <img src={merchant.logo_url} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-extrabold text-2xl" style={{ color: "#A78BFA" }}>{businessName.charAt(0) || "?"}</span>
                      )}
                    </div>
                    <input ref={logoRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => { if (e.target.files?.[0]) uploadFile(e.target.files[0], "logo"); }} />
                    <GlowButton variant="ghost" onClick={() => logoRef.current?.click()} disabled={uploading}>
                      <Upload className="w-4 h-4" /> {uploading ? "Upload…" : "Changer le logo"}
                    </GlowButton>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5">
                <GlowButton onClick={saveCommerce} disabled={saving}>
                  <Save className="w-4 h-4" /> {saving ? "Enregistrement…" : "Enregistrer"}
                </GlowButton>
              </div>
            </div>
          )}

          {activeTab === "carte" && (
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1 space-y-6">
                <h2 className="text-lg font-bold text-text-main">Personnalisation de la carte</h2>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-text-main">Couleur principale</label>
                  <div className="flex items-center gap-4">
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer border-0 p-0" />
                    <span className="text-sm font-mono text-text-muted">{color}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-text-main">Image d&apos;en-tête (Strip)</label>
                  <input ref={stripRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) uploadFile(e.target.files[0], "strip"); }} />
                  <div onClick={() => stripRef.current?.click()}
                    className="p-4 rounded-xl text-center cursor-pointer transition-colors hover:bg-white/5"
                    style={{ border: "2px dashed rgba(124,58,237,0.3)" }}>
                    <Upload className="w-6 h-6 mx-auto mb-2 text-text-muted" />
                    <span className="text-sm text-text-main font-medium">{uploading ? "Upload…" : "Uploader une image"}</span>
                    <p className="text-xs text-text-muted mt-1">320x100px recommandé · Max 2MB</p>
                  </div>
                  {merchant?.strip_url && (
                    <p className="text-xs flex items-center gap-1" style={{ color: "#34D399" }}>
                      <CheckCircle2 className="w-3 h-3" /> Image d&apos;en-tête configurée
                    </p>
                  )}
                </div>

                <div className="pt-6 border-t border-white/5 space-y-5">
                  <h3 className="font-bold text-text-main">Règles de fidélité</h3>
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5">Points pour la récompense</label>
                    <input type="number" min={1} value={threshold} onChange={(e) => setThreshold(Math.max(1, Number(e.target.value)))}
                      className="input-dark w-full rounded-xl py-3 px-4 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5">Récompense offerte</label>
                    <input type="text" value={rewardDesc} onChange={(e) => setRewardDesc(e.target.value)}
                      className="input-dark w-full rounded-xl py-3 px-4 text-sm" placeholder="Ex: 1 café offert" />
                  </div>
                </div>

                <GlowButton onClick={saveCarte} disabled={saving}>
                  <Save className="w-4 h-4" /> {saving ? "Enregistrement…" : "Mettre à jour la carte"}
                </GlowButton>
              </div>

              <div className="hidden lg:block w-72 pt-4">
                <p className="text-sm text-text-muted mb-4 text-center">Aperçu en direct</p>
                <motion.div
                  className="relative w-full h-[400px] rounded-3xl overflow-hidden text-white"
                  style={{ backgroundColor: color, boxShadow: `0 30px 60px ${color}55` }}
                  animate={{ backgroundColor: color }}
                  transition={{ duration: 0.3 }}>
                  <div className="p-6 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="font-extrabold text-xl">{businessName || "Mon Commerce"}</div>
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold backdrop-blur">
                        {(businessName || "M").charAt(0)}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <div className="text-xs opacity-70">Récompense</div>
                    <div className="font-bold">{rewardDesc || "1 café offert"}</div>
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <div className="text-xs opacity-70 mb-1">Points actuels</div>
                    <div className="text-4xl font-extrabold">0/{threshold}</div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {activeTab === "compte" && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-lg font-bold text-text-main">Sécurité du compte</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Email de connexion</label>
                  <input type="email" defaultValue={merchant?.email} disabled
                    className="input-dark w-full rounded-xl py-3 px-4 text-sm cursor-not-allowed opacity-60" />
                </div>
                <a href="/forgot-password" className="text-sm font-semibold inline-block" style={{ color: "#A78BFA" }}>
                  → Changer le mot de passe
                </a>
              </div>
              <div className="pt-6 border-t border-white/5">
                <h2 className="text-lg font-bold mb-4" style={{ color: "#FCA5A5" }}>Zone de danger</h2>
                <p className="text-sm text-text-muted mb-4">
                  La suppression de votre compte est définitive et supprimera toutes les cartes de vos clients.
                </p>
                <button className="px-6 py-3 rounded-xl font-medium transition-colors"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.3)" }}>
                  Supprimer mon compte
                </button>
              </div>
            </div>
          )}

          {activeTab === "abonnement" && (
            <div className="max-w-2xl space-y-6">
              {!planStatus ? (
                <div className="text-text-muted text-sm">Chargement du statut d&apos;abonnement…</div>
              ) : planStatus.plan === "pro" ? (
                <div className="p-6 rounded-2xl space-y-5"
                     style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(37,99,235,0.12))",
                              border: "1px solid rgba(124,58,237,0.4)" }}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2"
                           style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)", color: "white" }}>
                        <Sparkles className="w-3.5 h-3.5" /> Plan Pro
                      </div>
                      <h3 className="text-2xl font-extrabold text-text-main">Votre plan Pro est actif</h3>
                      {planStatus.plan_expires_at && (
                        <p className="text-sm text-text-muted mt-1">
                          Prochaine échéance : <strong className="text-text-main">
                            {new Date(planStatus.plan_expires_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          </strong>
                        </p>
                      )}
                    </div>
                    <div className="text-3xl font-extrabold"><GradientText>70€</GradientText>
                      <span className="text-base font-medium text-text-muted">/mois</span></div>
                  </div>
                  <ul className="space-y-2 text-sm text-text-main">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Clients illimités</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Notifications push</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Mise à jour temps réel</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Support prioritaire</li>
                  </ul>
                  <GlowButton variant="ghost" fullWidth onClick={handleManageSubscription}>
                    <ExternalLink className="w-4 h-4" /> Gérer mon abonnement
                  </GlowButton>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {/* Plan actuel : Gratuit */}
                  <div className="p-6 rounded-2xl"
                       style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-extrabold text-text-main">Plan Gratuit</h3>
                        <p className="text-sm text-text-muted mt-1">Limité à 50 clients</p>
                      </div>
                      <div className="text-2xl font-extrabold text-text-main">0€<span className="text-sm font-medium text-text-muted">/mois</span></div>
                    </div>
                  </div>

                  {/* Plan Pro avec CTA */}
                  <div className="relative">
                    <div className="absolute -inset-px rounded-2xl pulse-glow"
                         style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }} aria-hidden />
                    <div className="relative p-6 rounded-2xl space-y-5"
                         style={{ background: "rgba(22,22,31,0.95)", border: "1px solid rgba(124,58,237,0.4)" }}>
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2"
                               style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)", color: "white" }}>
                            <Sparkles className="w-3.5 h-3.5" /> Recommandé
                          </div>
                          <h3 className="text-2xl font-extrabold text-text-main">Plan Pro</h3>
                          <p className="text-sm text-text-muted mt-1">Pour scaler votre fidélité</p>
                        </div>
                        <div className="text-3xl font-extrabold"><GradientText>70€</GradientText>
                          <span className="text-base font-medium text-text-muted">/mois</span></div>
                      </div>
                      <ul className="space-y-2 text-sm text-text-main">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Clients <strong>illimités</strong></li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Notifications push</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Mise à jour temps réel</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Analytics avancés</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Support prioritaire</li>
                      </ul>
                      <GlowButton fullWidth size="lg" onClick={handleUpgrade} disabled={checkoutLoading}>
                        {checkoutLoading ? "Redirection vers Stripe…" : "Passer au Plan Pro — 70€/mois"}
                      </GlowButton>
                      <p className="text-xs text-text-muted text-center">Paiement sécurisé par Stripe · Sans engagement · Annulable à tout moment</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

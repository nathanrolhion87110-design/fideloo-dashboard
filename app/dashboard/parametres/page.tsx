"use client";

import { useState, useRef, useEffect } from "react";
import { Store, CreditCard, Palette, Shield, Save, Upload, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function SettingsPage() {
  const { merchant, updateMerchant } = useAuth();
  const [activeTab, setActiveTab] = useState("commerce");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Commerce tab
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("restaurant");

  // Carte tab
  const [color, setColor] = useState("#6366F1");
  const [threshold, setThreshold] = useState(10);
  const [rewardDesc, setRewardDesc] = useState("");

  const logoRef = useRef<HTMLInputElement>(null);
  const stripRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!merchant) return;
    setBusinessName(merchant.business_name || "");
    setBusinessType((merchant as any).business_type || "restaurant");
    setColor(merchant.primary_color || "#6366F1");
    setThreshold(merchant.reward_threshold || 10);
    setRewardDesc(merchant.reward_description || "");
  }, [merchant]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const saveCommerce = async () => {
    if (!merchant) return;
    setSaving(true);
    try {
      const res = await api.put(`/merchants/${merchant.id}`, {
        business_name: businessName,
        business_type: businessType
      });
      updateMerchant(res.data);
      showSuccess("Informations du commerce enregistrées !");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const saveCarte = async () => {
    if (!merchant) return;
    setSaving(true);
    try {
      const res = await api.put(`/merchants/${merchant.id}`, {
        primary_color: color,
        reward_threshold: threshold,
        reward_description: rewardDesc
      });
      updateMerchant(res.data);
      showSuccess("Carte mise à jour !");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (file: File, type: "logo" | "strip") => {
    if (!merchant) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const token = localStorage.getItem("fideloo_token");
      const res = await fetch(`${API_URL}/merchants/${merchant.id}/upload?type=${type}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        const update = type === "logo" ? { logo_url: data.url } : { strip_url: data.url };
        updateMerchant(update as any);
        showSuccess("Image uploadée avec succès !");
      } else {
        alert(data.error || "Erreur lors de l'upload");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const tabs = [
    { id: "commerce", label: "Commerce", icon: Store },
    { id: "carte", label: "Carte Wallet", icon: Palette },
    { id: "compte", label: "Compte", icon: Shield },
    { id: "abonnement", label: "Abonnement", icon: CreditCard },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Paramètres</h1>
        <p className="text-text-muted mt-1">Gérez votre commerce et votre abonnement</p>
      </div>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-success/10 text-success px-4 py-3 rounded-xl text-sm font-medium"
        >
          <CheckCircle2 className="w-4 h-4" />
          {successMsg}
        </motion.div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 p-4">
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white text-primary shadow-sm border border-slate-100"
                    : "text-text-muted hover:text-text-main hover:bg-slate-100"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-primary" : "text-slate-400"}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 p-6 md:p-8">
          {activeTab === "commerce" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
              <h2 className="text-lg font-bold text-text-main">Informations du commerce</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">Nom du commerce</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 text-text-main focus:border-primary focus:ring-primary focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">Type de commerce</label>
                  <select
                    value={businessType}
                    onChange={e => setBusinessType(e.target.value)}
                    className="block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 text-text-main focus:border-primary focus:ring-primary focus:bg-white transition-colors appearance-none"
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="boulangerie">Boulangerie</option>
                    <option value="boutique">Boutique</option>
                    <option value="coiffeur">Coiffeur</option>
                    <option value="cafe">Café</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">Logo du commerce</label>
                  <div className="flex items-center gap-6 mt-2">
                    <div className="w-20 h-20 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 overflow-hidden flex-shrink-0">
                      {merchant?.logo_url ? (
                        <img src={merchant.logo_url} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-primary text-2xl">{businessName.charAt(0) || "?"}</span>
                      )}
                    </div>
                    <input
                      ref={logoRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => { if (e.target.files?.[0]) uploadFile(e.target.files[0], "logo"); }}
                    />
                    <button
                      onClick={() => logoRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      {uploading ? "Upload en cours..." : "Changer le logo"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <button
                  onClick={saveCommerce}
                  disabled={saving}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "carte" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1 space-y-6">
                <h2 className="text-lg font-bold text-text-main">Personnalisation de la carte</h2>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-text-main">Couleur principale</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={color}
                      onChange={e => setColor(e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-sm font-mono text-text-muted">{color}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-text-main">Image d'en-tête (Strip)</label>
                  <input
                    ref={stripRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => { if (e.target.files?.[0]) uploadFile(e.target.files[0], "strip"); }}
                  />
                  <div
                    onClick={() => stripRef.current?.click()}
                    className="p-4 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-center cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <span className="text-sm text-text-main font-medium">
                      {uploading ? "Upload en cours..." : "Uploader une image"}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">320x100px recommandé · Max 2MB</p>
                  </div>
                  {merchant?.strip_url && (
                    <p className="text-xs text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Image d'en-tête configurée
                    </p>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-5">
                  <h3 className="font-bold text-text-main">Règles de fidélité</h3>
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1">
                      Points nécessaires pour la récompense
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={threshold}
                      onChange={e => setThreshold(Math.max(1, Number(e.target.value)))}
                      className="block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 text-text-main focus:border-primary focus:ring-primary focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1">Récompense offerte</label>
                    <input
                      type="text"
                      value={rewardDesc}
                      onChange={e => setRewardDesc(e.target.value)}
                      placeholder="Ex: 1 café offert"
                      className="block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 text-text-main focus:border-primary focus:ring-primary focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  onClick={saveCarte}
                  disabled={saving}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Enregistrement..." : "Mettre à jour la carte"}
                </button>
              </div>

              <div className="hidden lg:block w-72 pt-4">
                <p className="text-sm text-text-muted mb-4 text-center">Aperçu en direct</p>
                <motion.div
                  className="relative w-full h-[400px] rounded-3xl shadow-2xl overflow-hidden text-white"
                  style={{ backgroundColor: color }}
                  animate={{ backgroundColor: color }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-xl">{businessName || "Mon Commerce"}</div>
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                        {(businessName || "M").charAt(0)}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-white/10">
                    <div className="text-xs opacity-70">Récompense</div>
                    <div className="font-bold">{rewardDesc || "1 café offert"}</div>
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <div className="text-xs opacity-70 mb-1">Points actuels</div>
                    <div className="text-4xl font-bold">0/{threshold}</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === "compte" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
              <h2 className="text-lg font-bold text-text-main">Sécurité du compte</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">Email de connexion</label>
                  <input
                    type="email"
                    defaultValue={merchant?.email}
                    disabled
                    className="block w-full rounded-xl border-slate-200 bg-slate-100 py-3 px-4 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <a href="/forgot-password" className="text-primary font-medium text-sm hover:underline inline-block">
                  → Changer le mot de passe
                </a>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <h2 className="text-lg font-bold text-error mb-4">Zone de danger</h2>
                <p className="text-sm text-text-muted mb-4">
                  La suppression de votre compte est définitive et supprimera toutes les cartes de vos clients.
                </p>
                <button className="px-6 py-3 bg-error/10 text-error font-medium rounded-xl hover:bg-error/20 transition-colors">
                  Supprimer mon compte
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "abonnement" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
              <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-primary">Plan Gratuit</h3>
                    <p className="text-sm text-indigo-600/80 mt-1">Limité à 50 clients maximum</p>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    0€<span className="text-base font-medium text-indigo-600/80">/mois</span>
                  </div>
                </div>
                <div className="mt-6 mb-2 flex justify-between text-sm font-medium text-primary">
                  <span>Utilisation (Clients)</span>
                  <span>— / 50</span>
                </div>
                <div className="w-full bg-white rounded-full h-2 overflow-hidden mb-6">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }} />
                </div>
                <button className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 transition-all hover:-translate-y-0.5">
                  Passer au Plan Pro (Illimité)
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

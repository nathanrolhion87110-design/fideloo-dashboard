"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, QrCode, CheckCircle2, ChevronRight, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

export default function Onboarding() {
  const { merchant, updateMerchant } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [color, setColor] = useState(merchant?.primary_color || "#C9A84C");
  const [businessName, setBusinessName] = useState(merchant?.business_name || "Mon Commerce");
  const [businessType, setBusinessType] = useState(merchant?.business_type || "restaurant");
  const [pointsThreshold, setPointsThreshold] = useState(merchant?.reward_threshold || 10);
  const [rewardDesc, setRewardDesc] = useState(merchant?.reward_description || "1 café offert");
  const [saving, setSaving] = useState(false);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));

  const handleComplete = async () => {
    if (!merchant) {
      router.push("/dashboard");
      return;
    }
    setSaving(true);
    try {
      const res = await api.put(`/merchants/${merchant.id}`, {
        business_name: businessName,
        business_type: businessType,
        primary_color: color,
        reward_threshold: pointsThreshold,
        reward_description: rewardDesc,
        onboarding_complete: true,
        onboarding_step: 4
      });
      updateMerchant(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
      router.push("/dashboard");
    }
  };

  const inputClass = "block w-full rounded-xl py-3 px-4 text-[#F5F0E8] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-colors"
    + " bg-[#141414] border border-[rgba(201,168,76,0.2)] placeholder-[#8A8070]";

  const steps = ["Design", "Infos", "Récompense", "Prêt"];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#080808" }}>
      {/* Barre de progression */}
      <div className="border-b py-4 px-6 fixed top-0 w-full z-50"
        style={{ backgroundColor: "#0F0F0F", borderColor: "rgba(201,168,76,0.15)" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="font-bold flex items-center gap-2" style={{ color: "#F1F5F9" }}>
            <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", color: "#080808" }}>F</div>
            Fideloo
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: "#94A3B8" }}>
            {steps.map((label, i) => (
              <span key={label} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-4 h-4" style={{ color: "#475569" }} />}
                <span style={step >= i + 1 ? { color: "#C9A84C", fontWeight: 600 } : {}}>
                  {label}
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className="max-w-3xl mx-auto mt-3">
          <div className="w-full rounded-full h-1.5" style={{ backgroundColor: "#1E1E2E" }}>
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%`, background: "linear-gradient(90deg, #C9A84C, #E8C87A)" }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto mt-28 mb-12 flex flex-col md:flex-row gap-12 px-6">
        {/* Carte formulaire */}
        <div className="flex-1 p-8 rounded-[2rem] shadow-xl flex flex-col justify-center"
          style={{ backgroundColor: "#141414", border: "1px solid rgba(201,168,76,0.15)" }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-bold" style={{ color: "#F1F5F9" }}>
                    Voici votre carte de fidélité !
                  </h2>
                  <p className="mt-2" style={{ color: "#94A3B8" }}>
                    Personnalisez l'apparence de la carte dans le téléphone de vos clients.
                  </p>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium" style={{ color: "#94A3B8" }}>
                    Couleur principale
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={color}
                      onChange={e => setColor(e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-sm" style={{ color: "#94A3B8" }}>
                      Choisissez la couleur de votre marque
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium" style={{ color: "#94A3B8" }}>
                    Image de fond ou Logo (Optionnel)
                  </label>
                  <button
                    className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed rounded-xl transition-colors"
                    style={{ borderColor: "rgba(201,168,76,0.3)", color: "#8A8070" }}
                  >
                    <Upload className="w-5 h-5" />
                    Ajouter une image (depuis les Paramètres)
                  </button>
                  <p className="text-xs" style={{ color: "#475569" }}>
                    L'upload d'image est disponible dans les Paramètres après configuration.
                  </p>
                </div>
                <button
                  onClick={nextStep}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-bold transition-all mt-8"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", color: "#080808" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  J'aime cette carte <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-bold" style={{ color: "#F1F5F9" }}>
                    Informations du commerce
                  </h2>
                  <p className="mt-2" style={{ color: "#94A3B8" }}>
                    Ces informations seront visibles par vos clients.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "#94A3B8" }}>
                      Nom du commerce
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "#94A3B8" }}>
                      Type de commerce
                    </label>
                    <select
                      value={businessType}
                      onChange={e => setBusinessType(e.target.value)}
                      className={inputClass}
                      style={{ appearance: "none" }}
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
                <button
                  onClick={nextStep}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-bold transition-all mt-8"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", color: "#080808" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Continuer <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-bold" style={{ color: "#F1F5F9" }}>
                    Configurer la récompense
                  </h2>
                  <p className="mt-2" style={{ color: "#94A3B8" }}>
                    Définissez quand et comment vos clients sont récompensés.
                  </p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "#94A3B8" }}>
                      Points nécessaires :{" "}
                      <span className="font-bold" style={{ color: "#C9A84C" }}>{pointsThreshold}</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={pointsThreshold}
                      onChange={e => setPointsThreshold(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
                      style={{ backgroundColor: "#1E1E2E" }}
                    />
                    <div className="flex justify-between text-xs mt-1" style={{ color: "#475569" }}>
                      <span>5</span><span>20</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "#94A3B8" }}>
                      Description de la récompense
                    </label>
                    <input
                      type="text"
                      value={rewardDesc}
                      onChange={e => setRewardDesc(e.target.value)}
                      className={inputClass}
                      placeholder="Ex: 1 café offert"
                    />
                  </div>
                </div>
                <button
                  onClick={nextStep}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-bold transition-all mt-8"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", color: "#080808" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Vérifier ma configuration <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                  style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22C55E" }}>
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold" style={{ color: "#F1F5F9" }}>Prêt à lancer !</h2>
                <p style={{ color: "#94A3B8" }}>
                  Votre carte est configurée. Téléchargez votre QR code depuis le dashboard et commencez à fidéliser dès aujourd'hui.
                </p>
                <div className="p-4 rounded-xl text-left"
                  style={{ backgroundColor: "#0F0F0F", border: "1px solid rgba(201,168,76,0.15)" }}>
                  <h3 className="font-bold mb-3" style={{ color: "#F1F5F9" }}>Résumé :</h3>
                  <ul className="text-sm space-y-2" style={{ color: "#94A3B8" }}>
                    <li>• <strong style={{ color: "#F1F5F9" }}>Commerce :</strong> {businessName}</li>
                    <li>• <strong style={{ color: "#F1F5F9" }}>Couleur :</strong>{" "}
                      <span className="inline-block w-3 h-3 rounded-full align-middle mr-1" style={{ backgroundColor: color }} />
                      {color}
                    </li>
                    <li>• <strong style={{ color: "#F1F5F9" }}>Récompense :</strong> {rewardDesc}</li>
                    <li>• <strong style={{ color: "#F1F5F9" }}>Seuil :</strong> {pointsThreshold} points</li>
                  </ul>
                </div>
                <button
                  onClick={handleComplete}
                  disabled={saving}
                  className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-md text-base font-bold transition-all mt-8 disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", color: "#080808" }}
                  onMouseEnter={e => !saving && (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  {saving ? "Enregistrement..." : "Accéder à mon dashboard →"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Aperçu carte (steps 1–3) */}
        {step !== 4 && (
          <div className="hidden md:flex flex-1 items-center justify-center sticky top-24 h-[calc(100vh-6rem)]">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl rounded-full opacity-30"
                style={{ backgroundColor: color }} />
              <motion.div
                className="relative z-10 w-[320px] h-[450px] rounded-3xl shadow-2xl flex flex-col text-white overflow-hidden"
                style={{ backgroundColor: color }}
                animate={{ backgroundColor: color }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6 pb-2">
                  <div className="flex justify-between items-start mb-4">
                    <div className="font-bold text-xl">{businessName}</div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-inner"
                      style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                      <span className="text-xl font-bold">{businessName.charAt(0)}</span>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                  <div className="text-sm opacity-80 font-medium">Récompense</div>
                  <div className="text-xl font-bold">{rewardDesc}</div>
                </div>
                <div className="flex-1 px-6 py-6 flex flex-col justify-end">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <div className="text-sm opacity-80 mb-1">Points actuels</div>
                      <div className="text-5xl font-bold">0/{pointsThreshold}</div>
                    </div>
                    <div className="w-16 h-16 bg-white rounded-lg p-1 shadow-md">
                      <QrCode className="w-full h-full text-slate-800" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

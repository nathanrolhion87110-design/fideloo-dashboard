"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, QrCode, CheckCircle2, Upload, ArrowLeft, Clock, HelpCircle, Check, Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

const STEPS_LABELS = ["Design", "Infos", "Récompense", "Prêt"];
const TIME_REMAINING = ["Environ 2 minutes restantes", "Environ 1 min 30 restantes", "Environ 45 secondes restantes", "C'est prêt !"];

/* ── Confetti particle ── */
function Confetti() {
  const particles = Array.from({ length: 32 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    dur: 1.2 + Math.random() * 1.2,
    color: ["#B8873A", "#E8A84E", "#0B0F0E", "#34d399", "#F4F1EA"][i % 5],
    size: 6 + Math.random() * 8,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 200, overflow: "hidden" }}>
      {particles.map(({ id, x, delay, dur, color, size }) => (
        <div key={id} style={{
          position: "absolute", top: -20, left: `${x}%`,
          width: size, height: size, borderRadius: id % 3 === 0 ? "50%" : 2,
          background: color,
          animation: `confettiFall ${dur}s ${delay}s ease-in forwards`,
        }} />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ── Tooltip ── */
function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <HelpCircle
        size={14}
        color="rgba(255,255,255,0.35)"
        style={{ cursor: "help" }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      {show && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
          background: "#2A2A2A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
          padding: "8px 12px", fontSize: 12, color: "rgba(255,255,255,0.8)",
          zIndex: 100, lineHeight: 1.5, fontFamily: "var(--font-sora, system-ui)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          maxWidth: 220, whiteSpace: "normal",
        }}>
          {text}
          <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #2A2A2A" }} />
        </div>
      )}
    </span>
  );
}

export default function Onboarding() {
  const { merchant, updateMerchant } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [color, setColor] = useState(merchant?.primary_color || "#a78bfa");
  const [businessName, setBusinessName] = useState(merchant?.business_name || "Mon Commerce");
  const [businessType, setBusinessType] = useState(merchant?.business_type || "restaurant");
  const [pointsThreshold, setPointsThreshold] = useState(merchant?.reward_threshold || 10);
  const [rewardDesc, setRewardDesc] = useState(merchant?.reward_description || "1 café offert");
  const [saving, setSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (step === 4) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleComplete = async () => {
    if (!merchant) { router.push("/dashboard"); return; }
    setSaving(true);
    try {
      const res = await api.put(`/merchants/${merchant.id}`, {
        business_name: businessName, business_type: businessType,
        primary_color: color, reward_threshold: pointsThreshold,
        reward_description: rewardDesc, onboarding_complete: true, onboarding_step: 4,
      });
      updateMerchant(res.data);
    } catch (e) { console.error(e); }
    finally { setSaving(false); router.push("/dashboard"); }
  };

  const stepCircle = (i: number) => {
    const num = i + 1;
    if (step > num) return { bg: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.6)", color: "#34d399" };
    if (step === num) return { bg: "var(--violet)", border: "none", color: "#ffffff" };
    return { bg: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-dim)" };
  };

  const progressPct = ((step - 1) / (STEPS_LABELS.length - 1)) * 100;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0a0a0b" }}>
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="fixed top-0 w-full z-50 py-4 px-6"
        style={{ background: "rgba(10,10,11,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ background: "var(--violet)", color: "#ffffff" }}>F</div>
            <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>Fideloo</span>
          </div>
          {/* Step indicators — clickable to go back */}
          <div className="flex items-center gap-3">
            {STEPS_LABELS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                {i > 0 && <div className="w-8 h-px" style={{ background: step > i ? "rgba(52,211,153,0.5)" : "rgba(255,255,255,0.1)" }} />}
                <button
                  className="flex items-center gap-1.5"
                  onClick={() => { if (i + 1 < step) setStep(i + 1); }}
                  style={{ background: "none", border: "none", cursor: i + 1 < step ? "pointer" : "default", padding: 0 }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={stepCircle(i)}>
                    {step > i + 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className="text-xs hidden sm:block transition-colors"
                    style={{ color: step >= i + 1 ? "var(--text)" : "var(--text-dim)", fontWeight: step === i + 1 ? 600 : 400 }}>
                    {label}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar with % */}
        <div className="max-w-3xl mx-auto mt-3">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, var(--violet), #34d399)" }} />
            </div>
            <span style={{ fontSize: 11, color: "var(--text-dim)", whiteSpace: "nowrap", fontFamily: "var(--font-sora, system-ui)" }}>
              {Math.round(progressPct)}%
            </span>
          </div>
          {/* Time estimate */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <Clock size={11} color="rgba(255,255,255,0.3)" />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-sora, system-ui)" }}>
              {TIME_REMAINING[step - 1]}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto mt-36 mb-12 flex flex-col md:flex-row gap-10 px-6">
        {/* Form card */}
        <div className="flex-1 p-8 rounded-[22px] flex flex-col justify-center"
          style={{ background: "#14141a", border: "1px solid rgba(255,255,255,0.08)" }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Voici votre carte de fidélité !</h2>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-dim)" }}>
                    Personnalisez l&apos;apparence de la carte dans le téléphone de vos clients.
                  </p>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-dim)" }}>
                    Couleur principale
                    <Tooltip text="Choisissez la couleur de votre marque — elle sera visible sur la carte de fidélité de vos clients." />
                  </label>
                  <div className="flex items-center gap-4">
                    <input type="color" value={color} onChange={e => setColor(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0" />
                    <span className="text-sm font-mono" style={{ color: "var(--text-dim)" }}>
                      Choisissez la couleur de votre marque
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-dim)" }}>
                    Image de fond ou Logo
                    <Tooltip text="Ajoutez un logo ou une image de fond à votre carte. Disponible depuis les Paramètres après configuration." />
                  </label>
                  <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl transition-colors"
                    style={{ border: "2px dashed rgba(255,255,255,0.12)", color: "var(--text-dim)" }}>
                    <Upload className="w-5 h-5" />
                    Ajouter une image (depuis les Paramètres)
                  </button>
                </div>
                <button onClick={nextStep} className="btn btn-accent btn-lg w-full justify-center mt-4">
                  J&apos;aime cette carte <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Informations du commerce</h2>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-dim)" }}>Ces informations seront visibles par vos clients.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: "var(--text-dim)" }}>
                      Nom du commerce
                      <Tooltip text="Le nom affiché sur la carte de fidélité et dans les emails envoyés à vos clients." />
                    </label>
                    <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)}
                      className="input-field" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: "var(--text-dim)" }}>
                      Type de commerce
                      <Tooltip text="Permet à Fideloo de suggérer des récompenses adaptées à votre secteur." />
                    </label>
                    <select value={businessType} onChange={e => setBusinessType(e.target.value)}
                      className="input-field appearance-none">
                      <option value="restaurant">Restaurant</option>
                      <option value="boulangerie">Boulangerie</option>
                      <option value="coiffeur">Coiffeur</option>
                      <option value="cafe">Café</option>
                      <option value="boutique">Boutique</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={prevStep} className="btn btn-ghost btn-lg flex-1 justify-center">
                    <ArrowLeft className="w-4 h-4" /> Retour
                  </button>
                  <button onClick={nextStep} className="btn btn-accent btn-lg flex-1 justify-center">
                    Continuer <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Configurer la récompense</h2>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-dim)" }}>Définissez quand et comment vos clients sont récompensés.</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--text-dim)" }}>
                      Points nécessaires :
                      <span className="font-bold" style={{ color: "var(--violet)" }}>{pointsThreshold}</span>
                      <Tooltip text="Nombre de visites (ou d'achats) avant que le client obtienne sa récompense. Entre 5 et 20 est optimal." />
                    </label>
                    <input type="range" min="5" max="20" value={pointsThreshold}
                      onChange={e => setPointsThreshold(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{ accentColor: "#a78bfa", background: "rgba(255,255,255,0.08)" }} />
                    <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-dim)" }}>
                      <span>5</span><span>20</span>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: "var(--text-dim)" }}>
                      Description de la récompense
                      <Tooltip text="Ex: '1 café offert', '1 coupe offerte', '10% de remise'. Ce texte s'affiche sur la carte." />
                    </label>
                    <input type="text" value={rewardDesc} onChange={e => setRewardDesc(e.target.value)}
                      className="input-field" placeholder="Ex: 1 café offert" />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={prevStep} className="btn btn-ghost btn-lg flex-1 justify-center">
                    <ArrowLeft className="w-4 h-4" /> Retour
                  </button>
                  <button onClick={nextStep} className="btn btn-accent btn-lg flex-1 justify-center">
                    Vérifier <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="space-y-5">
                {/* Success icon */}
                <div className="flex flex-col items-center text-center mb-2">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Prêt à lancer !</h2>
                  <p style={{ color: "var(--text-dim)", fontSize: 14, marginTop: 8 }}>
                    Votre carte est configurée. Voici vos prochaines étapes.
                  </p>
                </div>

                {/* Checklist */}
                <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.15)" }}>
                  <h3 className="font-bold mb-3" style={{ color: "var(--text)", fontSize: 14 }}>Liste de démarrage</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Compte créé", done: true },
                      { label: "Carte configurée", done: true },
                      { label: "QR code prêt", done: true },
                      { label: "Imprimer le QR code en caisse", done: false },
                      { label: "Scanner votre premier client", done: false },
                    ].map(({ label, done }) => (
                      <div key={label} className="flex items-center gap-3">
                        <div style={{
                          width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                          background: done ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.06)",
                          border: done ? "1px solid rgba(52,211,153,0.5)" : "1px solid rgba(255,255,255,0.12)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {done && <Check size={11} color="#34d399" />}
                        </div>
                        <span style={{ fontSize: 13, color: done ? "var(--text)" : "var(--text-dim)" }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Résumé */}
                <div className="p-4 rounded-xl text-left" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.15)" }}>
                  <h3 className="font-bold mb-3" style={{ color: "var(--text)", fontSize: 14 }}>Résumé :</h3>
                  <ul className="text-sm space-y-2" style={{ color: "var(--text-dim)" }}>
                    <li>• <strong style={{ color: "var(--text)" }}>Commerce :</strong> {businessName}</li>
                    <li>• <strong style={{ color: "var(--text)" }}>Couleur :</strong>{" "}
                      <span className="inline-block w-3 h-3 rounded-full align-middle mr-1" style={{ backgroundColor: color }} />
                      {color}
                    </li>
                    <li>• <strong style={{ color: "var(--text)" }}>Récompense :</strong> {rewardDesc}</li>
                    <li>• <strong style={{ color: "var(--text)" }}>Seuil :</strong> {pointsThreshold} points</li>
                  </ul>
                </div>

                <button onClick={handleComplete} disabled={saving}
                  className="btn btn-accent btn-lg w-full justify-center disabled:opacity-70"
                  style={{ animation: !saving ? "pulse 2s ease-in-out infinite" : "none" }}>
                  {saving ? "Enregistrement..." : <>Accéder à mon dashboard <ArrowRight className="w-4 h-4" /></>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live card preview (steps 1–3) */}
        {step !== 4 && (
          <div className="hidden md:flex flex-1 items-center justify-center sticky top-36 h-[calc(100vh-9rem)]">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl rounded-full opacity-30" style={{ backgroundColor: color }} />
              <motion.div
                className="relative z-10 w-[320px] h-[450px] rounded-3xl shadow-2xl flex flex-col text-white overflow-hidden"
                style={{ backgroundColor: color }}
                animate={{ backgroundColor: color }}
                transition={{ duration: 0.3 }}>
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

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(167,139,250,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(167,139,250,0); }
        }
      `}</style>
    </div>
  );
}

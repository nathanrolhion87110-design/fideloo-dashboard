"use client";

import { useState, useEffect } from "react";
import { QrCode, CheckCircle2, Upload, HelpCircle, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const GRAY = "#6B6B6B";
const BG   = "#EDEBE4";
const WHITE = "#FFFFFF";
const BORD  = "#E0DDD6";
const BORD2 = "#D8D5CE";
const CARD  = "#F5F3EE";

const STEPS_LABELS = ["Design", "Infos", "Récompense", "Prêt"];

/* ── Confetti ── */
function Confetti() {
  const particles = Array.from({ length: 32 }, (_, i) => ({
    id: i, x: Math.random() * 100,
    delay: Math.random() * 0.8, dur: 1.2 + Math.random() * 1.2,
    color: ["#B8873A", "#E8A84E", "#0B0F0E", "#34d399", "#F4F1EA"][i % 5],
    size: 6 + Math.random() * 8,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 200, overflow: "hidden" }}>
      {particles.map(({ id, x, delay, dur, color, size }) => (
        <div key={id} style={{ position: "absolute", top: -20, left: `${x}%`, width: size, height: size, borderRadius: id % 3 === 0 ? "50%" : 2, background: color, animation: `confettiFall ${dur}s ${delay}s ease-in forwards` }} />
      ))}
      <style>{`@keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );
}

/* ── Tooltip ── */
function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <HelpCircle size={14} color={GOLD} style={{ cursor: "help" }}
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} />
      {show && (
        <div style={{ position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", background: "#2A2A2A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "rgba(255,255,255,0.8)", zIndex: 100, lineHeight: 1.5, fontFamily: "var(--font-sora, system-ui)", boxShadow: "0 4px 16px rgba(0,0,0,0.4)", maxWidth: 220, whiteSpace: "normal" }}>
          {text}
          <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #2A2A2A" }} />
        </div>
      )}
    </span>
  );
}

/* ── Wallet Card Preview ── */
function WalletCard({ color, businessName, rewardDesc, pointsThreshold }: { color: string; businessName: string; rewardDesc: string; pointsThreshold: number }) {
  return (
    <div style={{ background: color, borderRadius: 20, padding: 24, width: 260, color: WHITE, boxShadow: `0 24px 60px ${color}66` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
          {(businessName || "F").charAt(0).toUpperCase()}
        </div>
        <div style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 16, fontWeight: 600 }}>
          {businessName || "Mon Commerce"}
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" as const, marginBottom: 4 }}>Récompense</div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{rewardDesc || "1 récompense offerte"}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" as const, marginBottom: 4 }}>Points actuels</div>
          <div style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 28, fontWeight: 700 }}>0/{pointsThreshold}</div>
        </div>
        <QrCode size={28} color="rgba(255,255,255,0.7)" />
      </div>
    </div>
  );
}

export default function Onboarding() {
  const { merchant, updateMerchant } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [color, setColor] = useState(merchant?.primary_color || "#B8873A");
  const [colorHex, setColorHex] = useState(merchant?.primary_color || "#B8873A");
  const [businessName, setBusinessName] = useState(merchant?.business_name || "");
  const [businessType, setBusinessType] = useState((merchant?.business_type as string) || "restaurant");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [pointsThreshold, setPointsThreshold] = useState(merchant?.reward_threshold || 10);
  const [rewardDesc, setRewardDesc] = useState(merchant?.reward_description || "");
  const [welcomeMessage, setWelcomeMessage] = useState("Bienvenue dans notre programme de fidélité !");
  const [saving, setSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (step === 4) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const progressPct = ((step - 1) / (STEPS_LABELS.length - 1)) * 100;
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

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", background: CARD, border: `1px solid ${BORD}`,
    borderRadius: 8, fontSize: 14, color: INK, outline: "none", fontFamily: "inherit",
    boxSizing: "border-box", transition: "border-color 0.15s",
  };

  const btnPill: React.CSSProperties = {
    width: "100%", padding: "14px 24px", background: INK, color: WHITE, border: "none",
    borderRadius: 999, fontSize: 15, fontWeight: 600, cursor: "pointer", textAlign: "center",
    fontFamily: "var(--font-sora, system-ui)",
  };

  const btnBack: React.CSSProperties = {
    ...btnPill, background: CARD, color: INK, border: `1px solid ${BORD}`,
    flex: "0 0 auto", width: "auto", padding: "14px 24px",
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", color: INK }}>
      {showConfetti && <Confetti />}

      {/* ── Header ── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: WHITE, borderBottom: `1px solid ${BORD}`, display: "flex", flexDirection: "column" }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 80px" }}>
          {/* Logo */}
          <img src="/brand/fideloo-logo-linked.svg" alt="Fideloo" style={{ height: 28, width: "auto" }} />

          {/* Steps */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {STEPS_LABELS.map((label, i) => {
              const num = i + 1;
              const isActive = step === num;
              const isDone = step > num;
              return (
                <div key={label} style={{ display: "flex", alignItems: "center" }}>
                  {i > 0 && <div style={{ width: 40, height: 1, background: BORD2, margin: "0 8px" }} />}
                  <button
                    onClick={() => { if (isDone) setStep(num); }}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: isDone ? "pointer" : "default", padding: 0 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, fontFamily: "var(--font-sora, system-ui)",
                      background: isDone ? GOLD : isActive ? INK : "transparent",
                      border: `1px solid ${isDone ? GOLD : isActive ? INK : BORD2}`,
                      color: isDone || isActive ? WHITE : GRAY, transition: "all 0.2s",
                    }}>
                      {isDone ? <Check size={12} /> : num}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? INK : GRAY, fontFamily: "var(--font-sora, system-ui)" }}>
                      {label}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Counter */}
          <span style={{ fontSize: 13, color: GRAY, fontFamily: "var(--font-sora, system-ui)" }}>Étape {step}/4</span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: BORD }}>
          <div style={{ height: "100%", background: GOLD, width: `${progressPct}%`, transition: "width 0.4s ease" }} />
        </div>
      </header>

      {/* ── Content ── */}
      <main style={{ paddingTop: 64 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 80px" }}>

          {/* STEP 1 — Design */}
          {step === 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "55fr 45fr", gap: 64, alignItems: "start" }}>
              <div>
                <h1 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: 28, lineHeight: 1.2, marginBottom: 12 }}>
                  <span style={{ display: "block" }}>Voici votre carte</span>
                  <em style={{ fontStyle: "italic" }}>de fidélité.</em>
                </h1>
                <p style={{ fontSize: 14, color: GRAY, marginBottom: 32, lineHeight: 1.6 }}>
                  Personnalisez l&apos;apparence dans le téléphone de vos clients.
                </p>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: INK, marginBottom: 10 }}>
                    Couleur principale <Tooltip text="Choisissez la couleur de votre marque — elle sera visible sur la carte de vos clients." />
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input type="color" value={color}
                      onChange={e => { setColor(e.target.value); setColorHex(e.target.value); }}
                      style={{ width: 48, height: 48, borderRadius: 8, cursor: "pointer", border: `1px solid ${BORD}`, padding: 2, background: "transparent" }} />
                    <input type="text" value={colorHex}
                      onChange={e => { setColorHex(e.target.value); if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) setColor(e.target.value); }}
                      style={{ ...inputStyle, width: 130 }} placeholder="#B8873A" />
                  </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: INK, marginBottom: 10 }}>
                    Logo ou image de fond <Tooltip text="Ajoutez un logo ou une image. Modifiable depuis les Paramètres." />
                  </label>
                  <div style={{ background: CARD, border: `2px dashed ${BORD2}`, borderRadius: 12, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <Upload size={22} color={GOLD} />
                    <span style={{ fontSize: 13, color: GRAY, fontFamily: "var(--font-sora, system-ui)" }}>Glisser une image ou cliquer</span>
                  </div>
                </div>

                <button onClick={nextStep} style={btnPill}>J&apos;aime cette carte →</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 48 }}>
                <WalletCard color={color} businessName={businessName} rewardDesc={rewardDesc} pointsThreshold={pointsThreshold} />
              </div>
            </div>
          )}

          {/* STEP 2 — Infos */}
          {step === 2 && (
            <div style={{ display: "grid", gridTemplateColumns: "55fr 45fr", gap: 64, alignItems: "start" }}>
              <div>
                <h1 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: 28, lineHeight: 1.2, marginBottom: 12 }}>
                  <span style={{ display: "block" }}>Votre commerce,</span>
                  <em style={{ fontStyle: "italic" }}>en quelques mots.</em>
                </h1>
                <p style={{ fontSize: 14, color: GRAY, marginBottom: 32, lineHeight: 1.6 }}>Ces informations seront visibles par vos clients.</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                  {[
                    { label: "Nom du commerce", value: businessName, set: setBusinessName, placeholder: "Ex : Le Bon Café", type: "text" },
                    { label: "Adresse", value: address, set: setAddress, placeholder: "12 rue de la Paix, Paris", type: "text" },
                    { label: "Téléphone", value: phone, set: setPhone, placeholder: "01 23 45 67 89", type: "tel" },
                  ].map(({ label, value, set, placeholder, type }) => (
                    <div key={label}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>{label}</label>
                      <input type={type} value={value} onChange={e => set(e.target.value)} placeholder={placeholder} style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                        onBlur={e => (e.currentTarget.style.borderColor = BORD)} />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>
                      Site web <span style={{ color: GRAY, fontWeight: 400 }}>(optionnel)</span>
                    </label>
                    <input type="url" value={website} onChange={e => setWebsite(e.target.value)}
                      placeholder="https://moncommerce.fr" style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                      onBlur={e => (e.currentTarget.style.borderColor = BORD)} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={prevStep} style={btnBack}>← Retour</button>
                  <button onClick={nextStep} style={{ ...btnPill, flex: 1 }}>Continuer →</button>
                </div>
              </div>

              <div style={{ paddingTop: 48 }}>
                <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 16, padding: 24 }}>
                  <div style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 18, fontWeight: 600, color: INK, marginBottom: 4 }}>
                    {businessName || "Nom du commerce"}
                  </div>
                  <div style={{ fontSize: 13, color: GRAY, marginBottom: 12 }}>{address || "Adresse du commerce"}</div>
                  <div style={{ height: 1, background: BORD, marginBottom: 12 }} />
                  <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.6 }}>Voici comment vos clients verront votre commerce</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Récompense */}
          {step === 3 && (
            <div style={{ display: "grid", gridTemplateColumns: "55fr 45fr", gap: 64, alignItems: "start" }}>
              <div>
                <h1 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: 28, lineHeight: 1.2, marginBottom: 12 }}>
                  <span style={{ display: "block" }}>Quelle est</span>
                  <em style={{ fontStyle: "italic" }}>votre récompense ?</em>
                </h1>
                <p style={{ fontSize: 14, color: GRAY, marginBottom: 32, lineHeight: 1.6 }}>
                  Définissez quand et comment vos clients sont récompensés.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Nom de la récompense</label>
                    <input type="text" value={rewardDesc} onChange={e => setRewardDesc(e.target.value)}
                      placeholder="Ex : Un café offert" style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                      onBlur={e => (e.currentTarget.style.borderColor = BORD)} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Points nécessaires</label>
                    <input type="number" min={1} max={50} value={pointsThreshold}
                      onChange={e => setPointsThreshold(Math.max(1, Number(e.target.value)))}
                      style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                      onBlur={e => (e.currentTarget.style.borderColor = BORD)} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Message de bienvenue</label>
                    <textarea value={welcomeMessage} onChange={e => setWelcomeMessage(e.target.value)}
                      rows={3} placeholder="Bienvenue dans notre programme de fidélité !"
                      style={{ ...inputStyle, resize: "none", height: 84 }}
                      onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                      onBlur={e => (e.currentTarget.style.borderColor = BORD)} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={prevStep} style={btnBack}>← Retour</button>
                  <button onClick={nextStep} style={{ ...btnPill, flex: 1 }}>Continuer →</button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 48 }}>
                <WalletCard color={color} businessName={businessName} rewardDesc={rewardDesc} pointsThreshold={pointsThreshold} />
              </div>
            </div>
          )}

          {/* STEP 4 — Prêt */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, paddingTop: 40, textAlign: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <div style={{ animation: "pulse 2s ease-in-out infinite" }}>
                  <CheckCircle2 size={64} color={GOLD} />
                </div>
                <h1 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: 36, lineHeight: 1.2, color: INK }}>
                  <span style={{ display: "block" }}>Votre programme</span>
                  <em style={{ fontStyle: "italic", color: GOLD }}>est prêt !</em>
                </h1>
                <p style={{ fontSize: 15, color: GRAY, maxWidth: 440, lineHeight: 1.7 }}>
                  Tout est configuré. Accédez à votre dashboard pour scanner vos premiers clients.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
                {["Carte de fidélité créée", "Récompense configurée", "QR code généré"].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(184,135,58,0.12)", border: "1px solid rgba(184,135,58,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={12} color={GOLD} />
                    </div>
                    <span style={{ fontSize: 14, color: INK }}>{item}</span>
                  </div>
                ))}
              </div>

              <button onClick={handleComplete} disabled={saving}
                style={{ ...btnPill, width: "auto", padding: "16px 48px", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Enregistrement…" : "Accéder au dashboard →"}
              </button>
            </div>
          )}

        </div>
      </main>

      <style>{`
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Store, CreditCard, Palette, Shield, Save, Upload, CheckCircle2, ExternalLink, Sparkles, Copy, Share2, MessageCircle, Mail as MailIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

/* ── Tokens ─────────────────────────────── */
const CARD = "#FFFFFF"; const CARD2 = "#F5F3EE"; const INK = "#0B0F0E";
const GRAY = "#6B6B6B"; const BORD = "#E0DDD6"; const BORD2 = "#D0CDC6";
const GOLD = "#B8873A"; const GS = "rgba(184,135,58,0.10)"; const GB = "rgba(184,135,58,0.25)";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface PlanStatus { plan: "free" | "pro"; plan_expires_at: string | null; has_stripe_customer: boolean; }
interface MerchantUpdate {
  business_name?: string; business_type?: string;
  primary_color?: string; reward_threshold?: number; reward_description?: string;
  logo_url?: string; strip_url?: string;
}

function ReferralBlock({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  const copyLink = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Rejoignez Fideloo, la carte de fidélité dans votre téléphone 👉 ${link}`)}`;
  const mailUrl = `mailto:?subject=Fideloo — carte de fidélité digitale&body=${encodeURIComponent(`Bonjour,\n\nJe vous recommande Fideloo pour créer une carte de fidélité digitale (Apple Wallet & Google Wallet) pour votre commerce.\n\nCréez votre compte ici : ${link}\n\nÀ bientôt !`)}`;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Link display */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1, padding: "10px 14px", background: "#F5F3EE", border: `1px solid ${BORD}`, borderRadius: 10, fontSize: 12, color: GRAY, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {link}
        </div>
        <button onClick={copyLink}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", background: copied ? "#F5F3EE" : INK, color: copied ? GOLD : "#FFFFFF", border: `1px solid ${copied ? BORD : INK}`, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}>
          {copied ? <CheckCircle2 style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
          {copied ? "Copié !" : "Copier"}
        </button>
      </div>
      {/* Stats */}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, padding: "12px 16px", background: "#F5F3EE", border: `1px solid ${BORD}`, borderRadius: 10, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: GOLD }}>0</div>
          <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>filleuls parrainés</div>
        </div>
        <div style={{ flex: 1, padding: "12px 16px", background: "#F5F3EE", border: `1px solid ${BORD}`, borderRadius: 10, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: GOLD }}>0</div>
          <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>mois offerts</div>
        </div>
      </div>
      {/* Share buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", background: "#25D366", color: "#FFFFFF", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          <MessageCircle style={{ width: 14, height: 14 }} /> WhatsApp
        </a>
        <a href={mailUrl}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", background: "#F5F3EE", color: INK, border: `1px solid ${BORD}`, borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          <MailIcon style={{ width: 14, height: 14 }} /> Email
        </a>
      </div>
    </div>
  );
}

export default function SettingsPageWrapper() {
  return (
    <Suspense fallback={<div style={{ color: GRAY, padding: 24 }}>Chargement…</div>}>
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
  const [customerCount, setCustomerCount] = useState<number | null>(null);

  useEffect(() => {
    if (searchParams?.get("upgraded") === "true") {
      setActiveTab("abonnement");
      setSuccessMsg("🎉 Bienvenue sur le plan Pro ! Votre abonnement est actif.");
      setTimeout(() => setSuccessMsg(""), 6000);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!merchant) return;
    api.get<PlanStatus>(`/stripe/status/${merchant.id}`)
      .then((r) => setPlanStatus(r.data))
      .catch(() => setPlanStatus({ plan: "free", plan_expires_at: null, has_stripe_customer: false }));
    api.get<{ length: number } | unknown[]>(`/customers/${merchant.id}`)
      .then((r) => setCustomerCount(Array.isArray(r.data) ? r.data.length : 0))
      .catch(() => setCustomerCount(0));
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
  const [color, setColor] = useState("#B8873A");
  const [threshold, setThreshold] = useState(10);
  const [rewardDesc, setRewardDesc] = useState("");

  const logoRef = useRef<HTMLInputElement>(null);
  const stripRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!merchant) return;
    setBusinessName(merchant.business_name || "");
    setBusinessType((merchant.business_type as string) || "restaurant");
    setColor(merchant.primary_color || "#B8873A");
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

  const inputStyle = {
    width: "100%", padding: "12px 16px", background: CARD2, border: `1px solid ${BORD}`,
    borderRadius: 10, fontSize: 14, color: INK, outline: "none", fontFamily: "inherit",
    transition: "border-color 0.15s",
  };

  const btnPrimary = {
    display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px",
    background: INK, color: "#FFFFFF", border: "none", borderRadius: 999,
    fontSize: 14, fontWeight: 600, cursor: "pointer",
  } as const;

  const btnSecondary = {
    display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px",
    background: CARD2, color: INK, border: `1px solid ${BORD}`, borderRadius: 999,
    fontSize: 14, fontWeight: 600, cursor: "pointer",
  } as const;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: INK, letterSpacing: "-0.03em", fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)" }}>
          Paramètres
        </h1>
        <p style={{ fontSize: 13, color: GRAY, marginTop: 4 }}>Gérez votre commerce et votre abonnement</p>
      </div>

      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 12, fontSize: 14, fontWeight: 500, background: GS, color: GOLD, border: `1px solid ${GB}`, marginBottom: 20 }}>
          <CheckCircle2 style={{ width: 16, height: 16 }} /> {successMsg}
        </motion.div>
      )}

      {/* Settings card */}
      <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 600 }}>
        <div style={{ display: "flex", flexDirection: "row" }}>

          {/* Sidebar nav */}
          <div style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${BORD}`, background: CARD2, padding: 12 }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {tabs.map((t) => {
                const active = activeTab === t.id;
                return (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                      borderRadius: 10, fontSize: 14, fontWeight: active ? 600 : 400, cursor: "pointer",
                      background: active ? CARD : "transparent",
                      color: active ? INK : GRAY,
                      border: active ? `1px solid ${BORD}` : "1px solid transparent",
                      textAlign: "left", transition: "all 0.15s",
                      borderLeft: active ? `2px solid ${GOLD}` : "1px solid transparent",
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(11,15,14,0.04)"; }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    <t.icon style={{ width: 16, height: 16, opacity: active ? 1 : 0.6 }} />
                    {t.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: 32 }}>

            {/* Commerce */}
            {activeTab === "commerce" && (
              <div style={{ maxWidth: 560 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 24 }}>Informations du commerce</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Nom du commerce</label>
                    <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Type de commerce</label>
                    <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                      <option value="restaurant">Restaurant</option>
                      <option value="boulangerie">Boulangerie</option>
                      <option value="boutique">Boutique</option>
                      <option value="coiffeur">Coiffeur</option>
                      <option value="cafe">Café</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Logo du commerce</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <div style={{ width: 72, height: 72, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: GS, border: `1px solid ${GB}` }}>
                        {merchant?.logo_url ? (
                          <img src={merchant.logo_url} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <span style={{ fontWeight: 700, fontSize: 22, color: GOLD }}>{businessName.charAt(0) || "?"}</span>
                        )}
                      </div>
                      <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }}
                        onChange={(e) => { if (e.target.files?.[0]) uploadFile(e.target.files[0], "logo"); }} />
                      <button onClick={() => logoRef.current?.click()} disabled={uploading} style={btnSecondary}>
                        <Upload style={{ width: 15, height: 15 }} /> {uploading ? "Upload…" : "Changer le logo"}
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${BORD}` }}>
                  <button onClick={saveCommerce} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
                    <Save style={{ width: 15, height: 15 }} /> {saving ? "Enregistrement…" : "Enregistrer"}
                  </button>
                </div>
              </div>
            )}

            {/* Carte */}
            {activeTab === "carte" && (
              <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 280 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 24 }}>Personnalisation de la carte</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 8 }}>Couleur principale</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                          style={{ width: 44, height: 44, borderRadius: 8, cursor: "pointer", border: `1px solid ${BORD}`, padding: 2 }} />
                        <span style={{ fontSize: 13, fontFamily: "monospace", color: GRAY }}>{color}</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 8 }}>Image d&apos;en-tête (Strip)</label>
                      <input ref={stripRef} type="file" accept="image/*" style={{ display: "none" }}
                        onChange={(e) => { if (e.target.files?.[0]) uploadFile(e.target.files[0], "strip"); }} />
                      <div onClick={() => stripRef.current?.click()}
                        style={{ padding: 20, borderRadius: 12, textAlign: "center", cursor: "pointer", border: `2px dashed ${BORD2}`, transition: "border-color 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = GOLD)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = BORD2)}>
                        <Upload style={{ width: 20, height: 20, margin: "0 auto 8px", color: GRAY }} />
                        <span style={{ fontSize: 14, color: INK, fontWeight: 500 }}>{uploading ? "Upload…" : "Uploader une image"}</span>
                        <p style={{ fontSize: 12, color: GRAY, marginTop: 4 }}>320x100px recommandé · Max 2MB</p>
                      </div>
                      {merchant?.strip_url && (
                        <p style={{ fontSize: 12, color: GOLD, display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                          <CheckCircle2 style={{ width: 12, height: 12 }} /> Image d&apos;en-tête configurée
                        </p>
                      )}
                    </div>
                    <div style={{ paddingTop: 20, borderTop: `1px solid ${BORD}`, display: "flex", flexDirection: "column", gap: 16 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: INK }}>Règles de fidélité</h3>
                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Points pour la récompense</label>
                        <input type="number" min={1} value={threshold} onChange={(e) => setThreshold(Math.max(1, Number(e.target.value)))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Récompense offerte</label>
                        <input type="text" value={rewardDesc} onChange={(e) => setRewardDesc(e.target.value)}
                          placeholder="Ex: 1 café offert" style={inputStyle} />
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <button onClick={saveCarte} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
                      <Save style={{ width: 15, height: 15 }} /> {saving ? "Enregistrement…" : "Mettre à jour la carte"}
                    </button>
                  </div>
                </div>

                {/* Card preview */}
                <div style={{ width: 240, flexShrink: 0 }}>
                  <p style={{ fontSize: 13, color: GRAY, marginBottom: 12, textAlign: "center" }}>Aperçu en direct</p>
                  <motion.div
                    style={{ position: "relative", width: "100%", height: 380, borderRadius: 24, overflow: "hidden", color: "#FFFFFF", backgroundColor: color, boxShadow: `0 24px 60px ${color}55` }}
                    animate={{ backgroundColor: color }}
                    transition={{ duration: 0.3 }}>
                    <div style={{ padding: 24, paddingBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ fontWeight: 700, fontSize: 18 }}>{businessName || "Mon Commerce"}</div>
                        <div style={{ width: 36, height: 36, borderRadius: 18, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, backdropFilter: "blur(4px)" }}>
                          {(businessName || "M").charAt(0)}
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: "12px 24px", background: "rgba(255,255,255,0.12)" }}>
                      <div style={{ fontSize: 11, opacity: 0.7 }}>Récompense</div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{rewardDesc || "1 café offert"}</div>
                    </div>
                    <div style={{ position: "absolute", bottom: 24, left: 24 }}>
                      <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>Points actuels</div>
                      <div style={{ fontSize: 36, fontWeight: 700 }}>0/{threshold}</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Compte */}
            {activeTab === "compte" && (
              <div style={{ maxWidth: 560 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 24 }}>Sécurité du compte</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Email de connexion</label>
                    <input type="email" defaultValue={merchant?.email} disabled
                      style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }} />
                  </div>
                  <a href="/forgot-password" style={{ fontSize: 14, fontWeight: 600, color: GOLD, textDecoration: "none" }}>
                    → Changer le mot de passe
                  </a>
                </div>

                {/* ── Programme de parrainage ── */}
                <div style={{ marginTop: 32, paddingTop: 28, borderTop: `1px solid ${BORD}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <Share2 style={{ width: 16, height: 16, color: GOLD }} />
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: INK }}>Programme de parrainage</h2>
                  </div>
                  <p style={{ fontSize: 13, color: GRAY, marginBottom: 20, lineHeight: 1.6 }}>
                    Parrainez un commerçant et recevez <strong style={{ color: INK }}>1 mois gratuit</strong> à chaque inscription.
                  </p>
                  {merchant && (() => {
                    const refLink = `${typeof window !== "undefined" ? window.location.origin : "https://fideloo-dashboard-njfq.vercel.app"}/register?ref=${merchant.id}`;
                    return (
                      <ReferralBlock link={refLink} />
                    );
                  })()}
                </div>

                <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${BORD}` }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#DC2626", marginBottom: 12 }}>Zone de danger</h2>
                  <p style={{ fontSize: 14, color: GRAY, marginBottom: 16, lineHeight: 1.6 }}>
                    La suppression de votre compte est définitive et supprimera toutes les cartes de vos clients.
                  </p>
                  <button style={{ padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 500, background: "rgba(220,38,38,0.06)", color: "#DC2626", border: "1px solid rgba(220,38,38,0.2)", cursor: "pointer" }}>
                    Supprimer mon compte
                  </button>
                </div>
              </div>
            )}

            {/* Abonnement */}
            {activeTab === "abonnement" && (
              <div style={{ maxWidth: 560 }}>
                {!planStatus ? (
                  <div style={{ color: GRAY, fontSize: 14 }}>Chargement du statut d&apos;abonnement…</div>
                ) : planStatus.plan === "pro" ? (
                  <div style={{ padding: 28, borderRadius: 20, background: GS, border: `1px solid ${GB}` }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>
                      <div>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: GOLD, color: "#FFFFFF", marginBottom: 10 }}>
                          <Sparkles style={{ width: 12, height: 12 }} /> Plan Pro
                        </span>
                        <h3 style={{ fontSize: 22, fontWeight: 700, color: INK }}>Votre plan Pro est actif</h3>
                        {planStatus.plan_expires_at && (
                          <p style={{ fontSize: 13, color: GRAY, marginTop: 6 }}>
                            Prochaine échéance : <strong style={{ color: INK }}>{new Date(planStatus.plan_expires_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</strong>
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 28, fontWeight: 700, color: INK }}>70€</span>
                        <span style={{ fontSize: 14, color: GRAY }}>/mois</span>
                      </div>
                    </div>
                    <ul style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                      {["Clients illimités", "Notifications push", "Mise à jour temps réel", "Support prioritaire"].map((f) => (
                        <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: INK }}>
                          <CheckCircle2 style={{ width: 16, height: 16, color: GOLD, flexShrink: 0 }} /> {f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={handleManageSubscription} style={{ ...btnSecondary, width: "100%", justifyContent: "center" }}>
                      <ExternalLink style={{ width: 15, height: 15 }} /> Gérer mon abonnement
                    </button>
                    <button onClick={handleManageSubscription}
                      style={{ display: "block", margin: "12px auto 0", background: "transparent", border: "none", fontSize: 13, color: GRAY, cursor: "pointer", textDecoration: "underline" }}>
                      Annuler mon abonnement
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Free plan current */}
                    <div style={{ padding: 24, borderRadius: 16, background: CARD2, border: `1px solid ${BORD}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div>
                          <h3 style={{ fontSize: 18, fontWeight: 700, color: INK }}>Plan Gratuit</h3>
                          <p style={{ fontSize: 13, color: GRAY, marginTop: 2 }}>Limité à 50 clients</p>
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: INK }}>0€<span style={{ fontSize: 14, fontWeight: 400, color: GRAY }}>/mois</span></div>
                      </div>
                      {customerCount !== null && (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 500, color: GRAY, marginBottom: 6 }}>
                            <span>Clients utilisés</span>
                            <span><strong style={{ color: INK }}>{customerCount}</strong> / 50</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 999, overflow: "hidden", background: BORD }}>
                            <div style={{ height: "100%", borderRadius: 999, transition: "width 0.5s ease",
                              width: `${Math.min((customerCount / 50) * 100, 100)}%`,
                              background: customerCount >= 50 ? "#DC2626" : customerCount >= 40 ? "#F59E0B" : GOLD }} />
                          </div>
                          {customerCount >= 50 && (
                            <p style={{ fontSize: 12, color: "#DC2626", marginTop: 10 }}>
                              ⚠️ Limite atteinte — passez au Plan Pro pour continuer à enregistrer des clients.
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Pro CTA */}
                    <div style={{ padding: 28, borderRadius: 20, background: INK, border: `2px solid ${GOLD}`, position: "relative" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
                        <div>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: GOLD, color: "#FFFFFF", marginBottom: 10 }}>
                            <Sparkles style={{ width: 12, height: 12 }} /> Recommandé
                          </span>
                          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF" }}>Plan Pro</h3>
                          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Pour scaler votre fidélité</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: 28, fontWeight: 700, color: GOLD }}>70€</span>
                          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>/mois</span>
                        </div>
                      </div>
                      <ul style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                        {["Clients illimités", "Notifications push", "Mise à jour temps réel", "Analytics avancés", "Support prioritaire"].map((f) => (
                          <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
                            <CheckCircle2 style={{ width: 16, height: 16, color: GOLD, flexShrink: 0 }} /> {f}
                          </li>
                        ))}
                      </ul>
                      <button onClick={handleUpgrade} disabled={checkoutLoading}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "16px 24px", background: GOLD, color: "#FFFFFF", border: "none", borderRadius: 999, fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: checkoutLoading ? 0.7 : 1 }}>
                        {checkoutLoading ? "Redirection vers Stripe…" : "Passer au Plan Pro — 70€/mois"}
                      </button>
                      <p style={{ fontSize: 12, textAlign: "center", color: "rgba(255,255,255,0.4)", marginTop: 12 }}>
                        Paiement sécurisé par Stripe · Sans engagement · Annulable à tout moment
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

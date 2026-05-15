"use client";

import { useState, useEffect, Suspense } from "react";
import { FileText, ExternalLink } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const GRAY = "#6B6B6B";
const BORD = "#E0DDD6";
const CARD = "#FFFFFF";
const CARD2 = "#F5F3EE";

interface PlanStatus { plan: "standard" | "pro"; plan_expires_at: string | null; has_stripe_customer: boolean; }

function FacturationContent() {
  const { merchant } = useAuth();
  const searchParams = useSearchParams();
  const [planStatus, setPlanStatus] = useState<PlanStatus | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (!merchant) return;
    api.get<PlanStatus>(`/stripe/status/${merchant.id}`)
      .then(r => setPlanStatus(r.data))
      .catch(() => setPlanStatus({ plan: "standard", plan_expires_at: null, has_stripe_customer: false }));
  }, [merchant]);

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await api.post<{ url?: string }>("/stripe/portal");
      if (res.data.url) window.location.href = res.data.url;
    } catch (e) { console.error(e); }
    finally { setPortalLoading(false); }
  };

  const renewalDate = planStatus?.plan_expires_at
    ? new Date(planStatus.plan_expires_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  const _ = searchParams; // ensure hook is used

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: INK, fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)" }}>
          Facturation <em style={{ fontStyle: "italic", fontWeight: 400 }}>et paiements.</em>
        </h1>
        <p style={{ fontSize: 14, color: GRAY, marginTop: 8 }}>Gérez vos factures et votre abonnement.</p>
      </div>

      {/* Résumé */}
      <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: INK, marginBottom: 16 }}>Résumé</h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: GRAY, marginBottom: 4 }}>Plan actuel</div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: "rgba(184,135,58,0.20)", border: "1px solid rgba(184,135,58,0.40)", color: GOLD }}>
              {planStatus?.plan === "pro" ? "Pro — 80€/mois" : "Standard — 50€/mois"}
            </span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: GRAY, marginBottom: 2 }}>Prochain renouvellement</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{renewalDate}</div>
          </div>
        </div>
        <button onClick={handlePortal} disabled={portalLoading}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: INK, color: "#FFFFFF", border: "none", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: portalLoading ? 0.7 : 1, fontFamily: "var(--font-sora, system-ui)" }}>
          <ExternalLink size={15} /> {portalLoading ? "Redirection…" : "Gérer via Stripe →"}
        </button>
      </div>

      {/* Historique */}
      <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${BORD}` }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: INK }}>Historique des factures</h2>
        </div>

        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr", gap: 16, padding: "12px 24px", background: CARD2, fontSize: 12, fontWeight: 700, color: GRAY, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
          <span>Date</span>
          <span>Description</span>
          <span>Montant</span>
          <span>Statut</span>
        </div>

        {/* Empty state */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "48px 24px", textAlign: "center" }}>
          <FileText size={40} color={GOLD} style={{ opacity: 0.7 }} />
          <p style={{ fontSize: 14, color: GRAY }}>Aucune facture pour le moment.</p>
        </div>
      </div>

      <p style={{ fontSize: 12, color: GRAY, textAlign: "center", marginTop: 20 }}>
        Les factures sont générées automatiquement par Stripe et envoyées par email.
      </p>
    </div>
  );
}

export default function FacturationPage() {
  return (
    <Suspense fallback={<div style={{ color: GRAY, padding: 24 }}>Chargement…</div>}>
      <FacturationContent />
    </Suspense>
  );
}

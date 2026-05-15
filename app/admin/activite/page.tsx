"use client";

const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const GRAY = "#6B6B6B";
const BORD = "#E0DDD6";
const CARD = "#FFFFFF";

interface ActivityItem {
  id: number;
  type: "signup" | "upgrade" | "expired" | "delete";
  text: string;
  time: string;
  color: string;
  bg: string;
  label: string;
}

const ACTIVITY: ActivityItem[] = [
  { id:  1, type: "signup",  text: "Le Bon Café a rejoint Fideloo",              time: "il y a 8 min",  color: "#15803D", bg: "#DCFCE7", label: "Inscription" },
  { id:  2, type: "upgrade", text: "Pizza Roma est passé au plan Pro",           time: "il y a 43 min", color: "#1D4ED8", bg: "#DBEAFE", label: "Upgrade"      },
  { id:  3, type: "expired", text: "Boulangerie Martin — essai terminé",         time: "il y a 2h",     color: "#92400E", bg: "#FEF3C7", label: "Essai expiré" },
  { id:  4, type: "signup",  text: "Salon Élise a rejoint Fideloo",              time: "il y a 3h",     color: "#15803D", bg: "#DCFCE7", label: "Inscription" },
  { id:  5, type: "upgrade", text: "Épicerie du Coin passé au plan Standard",    time: "il y a 5h",     color: "#1D4ED8", bg: "#DBEAFE", label: "Upgrade"      },
  { id:  6, type: "delete",  text: "Commerce Test a été supprimé",               time: "il y a 1j",     color: "#EF4444", bg: "#FEE2E2", label: "Suppression"  },
  { id:  7, type: "signup",  text: "Bar Le Central a rejoint Fideloo",           time: "il y a 1j",     color: "#15803D", bg: "#DCFCE7", label: "Inscription" },
  { id:  8, type: "expired", text: "Fromagerie Dupont — essai expiré",           time: "il y a 2j",     color: "#92400E", bg: "#FEF3C7", label: "Essai expiré" },
  { id:  9, type: "upgrade", text: "Brasserie du Marché passé au plan Business", time: "il y a 2j",     color: "#1D4ED8", bg: "#DBEAFE", label: "Upgrade"      },
  { id: 10, type: "signup",  text: "Librairie Papeterie a rejoint Fideloo",      time: "il y a 3j",     color: "#15803D", bg: "#DCFCE7", label: "Inscription" },
  { id: 11, type: "expired", text: "Snack du Port — essai terminé",              time: "il y a 3j",     color: "#92400E", bg: "#FEF3C7", label: "Essai expiré" },
  { id: 12, type: "upgrade", text: "Café des Artistes passé au plan Pro",        time: "il y a 4j",     color: "#1D4ED8", bg: "#DBEAFE", label: "Upgrade"      },
  { id: 13, type: "signup",  text: "Fleuriste Bouquet d'Or a rejoint Fideloo",   time: "il y a 4j",     color: "#15803D", bg: "#DCFCE7", label: "Inscription" },
  { id: 14, type: "delete",  text: "Test Commerçant supprimé",                   time: "il y a 5j",     color: "#EF4444", bg: "#FEE2E2", label: "Suppression"  },
  { id: 15, type: "signup",  text: "Pharmacie Santé Plus a rejoint Fideloo",     time: "il y a 5j",     color: "#15803D", bg: "#DCFCE7", label: "Inscription" },
  { id: 16, type: "expired", text: "Garage Auto Rapide — essai expiré",          time: "il y a 6j",     color: "#92400E", bg: "#FEF3C7", label: "Essai expiré" },
  { id: 17, type: "upgrade", text: "Coiffeur Tendance passé au plan Standard",   time: "il y a 6j",     color: "#1D4ED8", bg: "#DBEAFE", label: "Upgrade"      },
  { id: 18, type: "signup",  text: "Épicerie Fine Provence a rejoint Fideloo",   time: "il y a 7j",     color: "#15803D", bg: "#DCFCE7", label: "Inscription" },
  { id: 19, type: "upgrade", text: "Restaurant du Lac passé au plan Pro",        time: "il y a 7j",     color: "#1D4ED8", bg: "#DBEAFE", label: "Upgrade"      },
  { id: 20, type: "signup",  text: "Traiteur Méditerranée a rejoint Fideloo",    time: "il y a 8j",     color: "#15803D", bg: "#DCFCE7", label: "Inscription" },
];

const TYPE_COUNTS = {
  signup:  ACTIVITY.filter(a => a.type === "signup").length,
  upgrade: ACTIVITY.filter(a => a.type === "upgrade").length,
  expired: ACTIVITY.filter(a => a.type === "expired").length,
  delete:  ACTIVITY.filter(a => a.type === "delete").length,
};

export default function AdminActivitePage() {
  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: INK, fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)", margin: 0 }}>
          Activité <em style={{ fontStyle: "italic", fontWeight: 400 }}>temps réel.</em>
        </h1>
        <p style={{ fontSize: 13, color: GRAY, marginTop: 4 }}>Les 20 derniers événements sur la plateforme.</p>
      </div>

      {/* Résumé */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Inscriptions",  count: TYPE_COUNTS.signup,  color: "#15803D", bg: "#DCFCE7" },
          { label: "Upgrades",      count: TYPE_COUNTS.upgrade, color: "#1D4ED8", bg: "#DBEAFE" },
          { label: "Essais expirés",count: TYPE_COUNTS.expired, color: "#92400E", bg: "#FEF3C7" },
          { label: "Suppressions",  count: TYPE_COUNTS.delete,  color: "#EF4444", bg: "#FEE2E2" },
        ].map(({ label, count, color, bg }) => (
          <div key={label} style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 12, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color, fontSize: 16, fontWeight: 800 }}>{count}</span>
            </div>
            <div style={{ fontSize: 12, color: GRAY, fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, overflow: "hidden" }}>
        {ACTIVITY.map((item, i) => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${BORD}` : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: INK, fontWeight: 500 }}>{item.text}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: item.bg, color: item.color }}>
                {item.label}
              </span>
              <span style={{ fontSize: 12, color: GRAY, whiteSpace: "nowrap" }}>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

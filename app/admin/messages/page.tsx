"use client";

import { useState } from "react";
import { Mail, ExternalLink, Check } from "lucide-react";

const INK   = "#0B0F0E";
const GOLD  = "#B8873A";
const GRAY  = "#6B6B6B";
const BORD  = "#E0DDD6";
const CARD  = "#FFFFFF";
const CARD2 = "#F5F3EE";

interface Message {
  id: number;
  name: string;
  email: string;
  commerce: string;
  message: string;
  date: string;
  read: boolean;
}

const MOCK_MESSAGES: Message[] = [
  { id: 1,  name: "Marie Dupont",     email: "marie@cafedupont.fr",       commerce: "Café",         message: "Bonjour, je souhaite en savoir plus sur votre offre Pro. Est-ce que je peux avoir une démo personnalisée ?",                        date: "il y a 2h",  read: false },
  { id: 2,  name: "Thomas Renaud",    email: "thomas@pizzaroma.fr",       commerce: "Restaurant",   message: "Je rencontre un problème avec mon QR code. Il ne semble pas fonctionner correctement depuis hier soir.",                             date: "il y a 4h",  read: false },
  { id: 3,  name: "Sophie Martin",    email: "sophie@boulangerie.fr",     commerce: "Boulangerie",  message: "Votre solution est exactement ce qu'il me faut ! J'aimerais commencer avec le plan Standard. Comment procéder ?",                    date: "il y a 6h",  read: true  },
  { id: 4,  name: "Jean-Paul Lebrun", email: "jp@salonelise.fr",          commerce: "Salon",        message: "Bonjour, est-il possible d'avoir plus de 1500 clients sur le plan Standard ? Mon salon est très fréquenté.",                        date: "il y a 1j",  read: true  },
  { id: 5,  name: "Camille Petit",    email: "camille@epicerie.fr",       commerce: "Épicerie",     message: "Je voudrais savoir si vous avez une API pour synchroniser avec notre logiciel de caisse.",                                           date: "il y a 2j",  read: true  },
  { id: 6,  name: "Antoine Morel",    email: "antoine@bar-central.fr",    commerce: "Bar",          message: "Super service ! Mes clients adorent le système de points. Une question : peut-on personnaliser les récompenses ?",                   date: "il y a 3j",  read: true  },
  { id: 7,  name: "Lucie Bernard",    email: "lucie@fromagerie.fr",       commerce: "Fromagerie",   message: "Bonjour, mon essai se termine dans 3 jours. Je souhaite passer au plan Pro mais je ne trouve pas où le faire dans mon dashboard.",   date: "il y a 4j",  read: true  },
];

const AVATAR_COLORS = ["#B8873A", "#4B9CD3", "#6B8E23", "#9370DB", "#20B2AA", "#CD5C5C"];
const avatarColor = (s: string) => AVATAR_COLORS[(s?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
const initials    = (s: string) => (s || "??").slice(0, 2).toUpperCase();

type Filter = "all" | "unread" | "read";

export default function AdminMessagesPage() {
  const [messages, setMessages]     = useState<Message[]>(MOCK_MESSAGES);
  const [selected, setSelected]     = useState<Message | null>(messages[0]);
  const [filter, setFilter]         = useState<Filter>("all");

  const markRead = (id: number) => {
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const unreadCount = messages.filter(m => !m.read).length;

  const filtered = messages.filter(m => {
    if (filter === "unread") return !m.read;
    if (filter === "read")   return m.read;
    return true;
  });

  const FILTER_PILLS: { key: Filter; label: string }[] = [
    { key: "all",    label: `Tous (${messages.length})`   },
    { key: "unread", label: `Non lus (${unreadCount})`    },
    { key: "read",   label: "Lus"                         },
  ];

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: INK, fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)", margin: 0 }}>
            Messages <em style={{ fontStyle: "italic", fontWeight: 400 }}>& support.</em>
          </h1>
          {unreadCount > 0 && (
            <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, background: GOLD, color: "#FFFFFF", fontSize: 12, fontWeight: 700 }}>
              {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: GRAY }}>Messages reçus via le formulaire de contact.</p>
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {FILTER_PILLS.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)} style={{
            padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: filter === key ? 700 : 500,
            background: filter === key ? INK : CARD, color: filter === key ? "#FFFFFF" : GRAY,
            border: `1px solid ${filter === key ? INK : BORD}`, cursor: "pointer",
          }}>{label}</button>
        ))}
      </div>

      {/* Layout 2 colonnes */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, minHeight: 600 }}>

        {/* Liste */}
        <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, overflow: "hidden" }}>
          {filtered.map((msg, i) => (
            <div key={msg.id} onClick={() => { setSelected(msg); markRead(msg.id); }}
              style={{
                padding: "16px 20px", cursor: "pointer", borderBottom: i < filtered.length - 1 ? `1px solid ${BORD}` : "none",
                borderLeft: selected?.id === msg.id ? `2px solid ${GOLD}` : "2px solid transparent",
                background: selected?.id === msg.id ? CARD2 : CARD,
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: avatarColor(msg.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#FFFFFF", flexShrink: 0, position: "relative" }}>
                  {initials(msg.name)}
                  {!msg.read && <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: GOLD, border: "2px solid #FFFFFF" }} />}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: msg.read ? 500 : 700, color: INK }}>{msg.name}</span>
                    <span style={{ fontSize: 11, color: GRAY }}>{msg.date}</span>
                  </div>
                  <div style={{ fontSize: 12, color: GRAY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {msg.message.slice(0, 55)}…
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding: 48, textAlign: "center", color: GRAY, fontSize: 13 }}>Aucun message.</div>
          )}
        </div>

        {/* Détail */}
        {selected ? (
          <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 32, display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: avatarColor(selected.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>
                  {initials(selected.name)}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: INK }}>{selected.name}</div>
                  <div style={{ fontSize: 13, color: GRAY }}>{selected.email}</div>
                  <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>Type : {selected.commerce} · {selected.date}</div>
                </div>
              </div>
              {!selected.read && (
                <button onClick={() => markRead(selected.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${BORD}`, background: CARD, color: GRAY, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  <Check size={13} /> Marquer comme lu
                </button>
              )}
            </div>

            {/* Séparateur */}
            <div style={{ height: 1, background: BORD, marginBottom: 24 }} />

            {/* Corps */}
            <div style={{ flex: 1, fontSize: 15, color: INK, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {selected.message}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, marginTop: 32, paddingTop: 24, borderTop: `1px solid ${BORD}` }}>
              <a href={`mailto:${selected.email}?subject=Re: Fideloo — votre message&body=Bonjour ${selected.name.split(" ")[0]},%0A%0A`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: INK, color: "#FFFFFF", borderRadius: 999, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                <Mail size={14} /> Répondre par email
              </a>
              <a href={`/register?plan=trial&email=${encodeURIComponent(selected.email)}`}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: CARD, color: INK, border: `1px solid ${BORD}`, borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                <ExternalLink size={14} /> Créer un compte prospect
              </a>
            </div>
          </div>
        ) : (
          <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", color: GRAY, fontSize: 14 }}>
            Sélectionnez un message
          </div>
        )}
      </div>
    </>
  );
}

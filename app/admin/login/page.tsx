"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const GRAY = "#6B6B6B";
const BORD = "#E0DDD6";
const API  = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Identifiants invalides");
      localStorage.setItem("admin_token", data.token);
      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "12px 16px", borderRadius: 10,
    border: `1px solid ${BORD}`, fontSize: 14, color: INK,
    background: "#FAFAF8", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: INK, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: GOLD, letterSpacing: "-0.5px", marginBottom: 8 }}>
            Fideloo Admin
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Accès réservé à l&apos;équipe interne.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: "#FFFFFF", borderRadius: 20, padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
              Email
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} required placeholder="admin@fideloo.fr" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
              Mot de passe
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inp} required />
          </div>

          {error && (
            <p style={{ fontSize: 13, color: "#E53E3E", background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 8, padding: "10px 14px", margin: 0 }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} style={{
            padding: "14px", background: INK, color: "#FFFFFF", border: "none", borderRadius: 999,
            fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 4,
          }}>
            {loading ? "Connexion…" : "Se connecter →"}
          </button>
        </form>
      </div>
    </div>
  );
}

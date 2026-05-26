"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "../utils/api";

export interface Merchant {
  id: string;
  email: string;
  business_name: string;
  business_type: string;
  primary_color: string;
  reward_threshold: number;
  reward_description: string;
  onboarding_complete: boolean;
  onboarding_step: number;
  logo_url: string | null;
  strip_url: string | null;
  avatar_url: string | null;
  google_id: string | null;
  created_at: string;
  plan?: string;
}

interface AuthContextType {
  merchant: Merchant | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, merchantData: Merchant, refreshToken?: string) => void;
  logout: () => void;
  updateMerchant: (data: Partial<Merchant>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("fideloo_token");
    const storedMerchant = localStorage.getItem("fideloo_merchant");
    if (storedToken && storedMerchant) {
      setToken(storedToken);
      try {
        setMerchant(JSON.parse(storedMerchant));
      } catch (e) {
        console.error("Failed to parse merchant data");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, merchantData: Merchant, refreshToken?: string) => {
    localStorage.setItem("fideloo_token", newToken);
    localStorage.setItem("fideloo_merchant", JSON.stringify(merchantData));
    if (refreshToken) localStorage.setItem("fideloo_refresh_token", refreshToken);
    setToken(newToken);
    setMerchant(merchantData);
  };

  const logout = () => {
    localStorage.removeItem("fideloo_token");
    localStorage.removeItem("fideloo_merchant");
    localStorage.removeItem("fideloo_refresh_token");
    setToken(null);
    setMerchant(null);
    router.push("/login");
  };

  const updateMerchant = (data: Partial<Merchant>) => {
    if (!merchant) return;
    const updated = { ...merchant, ...data };
    setMerchant(updated);
    localStorage.setItem("fideloo_merchant", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ merchant, token, isLoading, login, logout, updateMerchant }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import {
  LogIn,
  User,
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const { language, t } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        if (data.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (e: any) {
      setError("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: "CITIZEN" | "ADMIN") => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDemo: true, demoRole: role }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        if (role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      } else {
        setError(data.error || "Demo login failed");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14 space-y-6">
      {/* Brand & Heading */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="font-display font-black text-2xl text-navy-900">{t.navLogin}</h1>
        <p className="text-xs text-navy-600">
          {language === "te"
            ? "జనసేతు పౌర సంక్షేమ పోర్టల్‌లోకి సురక్షితంగా ప్రవేశించండి."
            : "Sign in to access your saved schemes, assessment records, and checklists."}
        </p>
      </div>

      {/* 1-Click Demo Profiles */}
      <div className="p-4 rounded-2xl bg-ivory-100 border border-ivory-300 space-y-3">
        <span className="text-xs font-bold text-navy-900 flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-saffron-600" />
          <span>{language === "te" ? "తక్షణ డెమో ఖాతాల ఎంపిక" : "Instant 1-Click Demo Sign-In"}</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin("CITIZEN")}
            disabled={loading}
            className="p-3 rounded-xl bg-white hover:bg-teal-50/50 border border-teal-200 text-left transition shadow-xs"
          >
            <span className="font-bold text-xs text-navy-900 block">Citizen Profile</span>
            <span className="text-[11px] text-teal-700 block mt-0.5">Ramesh Babu (Farmer)</span>
            <span className="text-[10px] text-navy-400 mt-1 block">citizen@jansetu.gov.in</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin("ADMIN")}
            disabled={loading}
            className="p-3 rounded-xl bg-white hover:bg-navy-50 border border-navy-200 text-left transition shadow-xs"
          >
            <span className="font-bold text-xs text-navy-900 block">Portal Administrator</span>
            <span className="text-[11px] text-saffron-700 block mt-0.5">Admin Staff Role</span>
            <span className="text-[10px] text-navy-400 mt-1 block">admin@jansetu.gov.in</span>
          </button>
        </div>
      </div>

      {/* Standard Email/Password Form */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 sm:p-8 shadow-sm space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleStandardLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-navy-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@jansetu.gov.in"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-navy-200 text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-navy-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-navy-200 text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow transition flex items-center justify-center space-x-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? "Signing in..." : t.navLogin}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

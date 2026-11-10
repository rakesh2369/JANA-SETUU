"use client";

import React, { useState, useEffect } from "react";
import Link from "next/navigation";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import {
  Compass,
  FileCheck2,
  Bot,
  LayoutDashboard,
  ShieldAlert,
  Globe2,
  LogIn,
  LogOut,
  Menu,
  X,
  UserCheck,
  Building2,
  ChevronDown,
} from "lucide-react";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, [pathname]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch (e) {
      setCurrentUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      setUserDropdownOpen(false);
      router.push("/");
      router.refresh();
    } catch (e) {}
  };

  const handleQuickDemoSwitch = async (role: "CITIZEN" | "ADMIN") => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDemo: true, demoRole: role }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setUserDropdownOpen(false);
        if (role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (e) {}
  };

  const navLinks = [
    { href: "/schemes", label: t.navSchemes, icon: Compass },
    { href: "/assess", label: t.navAssess, icon: FileCheck2 },
    { href: "/assistant", label: t.navAssistant, icon: Bot },
    { href: "/dashboard", label: t.navDashboard, icon: LayoutDashboard },
  ];

  if (currentUser?.role === "ADMIN") {
    navLinks.push({ href: "/admin", label: t.navAdmin, icon: ShieldAlert });
  }

  return (
    <header className="sticky top-0 z-50 bg-navy-900 border-b border-navy-800 text-white shadow-md">
      {/* Top micro bar for official disclaimer / portal info */}
      <div className="bg-navy-950 py-1 px-4 text-xs text-navy-200 border-b border-navy-800/60 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          <span>{t.portalSubtitle}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline">Toll Free: 1902 (AP Spandana)</span>
          {/* Language Switcher Pill */}
          <div className="flex items-center space-x-1 bg-navy-900 px-2 py-0.5 rounded border border-navy-700">
            <Globe2 className="w-3.5 h-3.5 text-teal-400" />
            <button
              onClick={() => setLanguage("en")}
              className={`text-xs font-medium px-1.5 py-0.5 rounded transition ${
                language === "en" ? "bg-teal-600 text-white" : "text-navy-300 hover:text-white"
              }`}
            >
              English
            </button>
            <span className="text-navy-600">|</span>
            <button
              onClick={() => setLanguage("te")}
              className={`text-xs font-medium px-1.5 py-0.5 rounded transition ${
                language === "te" ? "bg-teal-600 text-white font-telugu" : "text-navy-300 hover:text-white"
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <a href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold shadow-inner border border-teal-400/30">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-black text-xl tracking-tight text-white group-hover:text-teal-300 transition">
                  {t.brandName}
                </span>
                <span className="text-[10px] uppercase tracking-widest bg-saffron-500/20 text-saffron-300 font-semibold px-2 py-0.5 rounded border border-saffron-400/30">
                  AP & National
                </span>
              </div>
              <p className="text-xs text-navy-300 line-clamp-1 hidden sm:block">
                {language === "te" ? "ప్రభుత్వ సంక్షేమ పథకాల మార్గదర్శక వేదిక" : "Public Welfare Guidance Gateway"}
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-teal-700/80 text-white shadow-sm"
                      : "text-navy-200 hover:bg-navy-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 text-teal-400" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* User Account / Demo Switcher */}
          <div className="hidden md:flex items-center space-x-3 relative">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 bg-navy-800 hover:bg-navy-700 border border-navy-700 px-3 py-1.5 rounded-lg text-sm transition"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold text-white">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white truncate max-w-[120px]">
                      {currentUser.name}
                    </p>
                    <span className="text-[10px] text-teal-300 block uppercase">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-navy-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white text-navy-900 shadow-xl border border-navy-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-navy-100 text-xs">
                      <p className="font-semibold">{currentUser.name}</p>
                      <p className="text-navy-500 truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      <a
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-navy-700 hover:bg-teal-50 hover:text-teal-800"
                      >
                        {t.navDashboard}
                      </a>
                      {currentUser.role === "ADMIN" && (
                        <a
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-navy-700 hover:bg-teal-50 hover:text-teal-800"
                        >
                          {t.navAdmin}
                        </a>
                      )}
                    </div>

                    <div className="border-t border-navy-100 py-1">
                      <div className="px-3 py-1 text-[11px] font-semibold text-navy-400 uppercase tracking-wider">
                        Switch Demo Role
                      </div>
                      <button
                        onClick={() => handleQuickDemoSwitch("CITIZEN")}
                        className="w-full text-left px-4 py-1.5 text-xs text-navy-700 hover:bg-teal-50 flex items-center justify-between"
                      >
                        <span>Citizen Profile (Ramesh)</span>
                        {currentUser.role === "CITIZEN" && (
                          <span className="text-[10px] text-teal-600 font-bold">Active</span>
                        )}
                      </button>
                      <button
                        onClick={() => handleQuickDemoSwitch("ADMIN")}
                        className="w-full text-left px-4 py-1.5 text-xs text-navy-700 hover:bg-teal-50 flex items-center justify-between"
                      >
                        <span>Admin Profile (Staff)</span>
                        {currentUser.role === "ADMIN" && (
                          <span className="text-[10px] text-teal-600 font-bold">Active</span>
                        )}
                      </button>
                    </div>

                    <div className="border-t border-navy-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t.navLogout}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuickDemoSwitch("CITIZEN")}
                  className="text-xs bg-navy-800 hover:bg-navy-700 text-teal-300 border border-teal-500/40 px-2.5 py-1.5 rounded transition"
                >
                  Demo Citizen
                </button>
                <button
                  onClick={() => handleQuickDemoSwitch("ADMIN")}
                  className="text-xs bg-navy-800 hover:bg-navy-700 text-saffron-300 border border-saffron-500/40 px-2.5 py-1.5 rounded transition"
                >
                  Demo Admin
                </button>
                <a
                  href="/login"
                  className="flex items-center space-x-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded shadow transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t.navLogin}</span>
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-navy-200 hover:text-white hover:bg-navy-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-950 border-t border-navy-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-md text-sm font-medium ${
                  isActive ? "bg-teal-700 text-white" : "text-navy-200 hover:bg-navy-800"
                }`}
              >
                <Icon className="w-4 h-4 text-teal-400" />
                <span>{link.label}</span>
              </a>
            );
          })}

          <div className="pt-3 border-t border-navy-800 space-y-2">
            {currentUser ? (
              <div className="space-y-2">
                <div className="text-xs text-navy-300">
                  Signed in as <span className="font-semibold text-white">{currentUser.name}</span> ({currentUser.role})
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleQuickDemoSwitch(currentUser.role === "ADMIN" ? "CITIZEN" : "ADMIN")}
                    className="flex-1 text-xs bg-navy-800 text-teal-300 py-1.5 rounded text-center border border-navy-700"
                  >
                    Switch to {currentUser.role === "ADMIN" ? "Citizen" : "Admin"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-xs bg-red-900/40 text-red-300 px-3 py-1.5 rounded border border-red-700/50"
                  >
                    {t.navLogout}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickDemoSwitch("CITIZEN")}
                  className="text-xs bg-navy-800 text-teal-300 py-2 rounded text-center border border-teal-500/40"
                >
                  Demo Citizen
                </button>
                <button
                  onClick={() => handleQuickDemoSwitch("ADMIN")}
                  className="text-xs bg-navy-800 text-saffron-300 py-2 rounded text-center border border-saffron-500/40"
                >
                  Demo Admin
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


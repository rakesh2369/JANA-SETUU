"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import SchemeCard from "@/components/SchemeCard";
import {
  LayoutDashboard,
  Bookmark,
  FileCheck2,
  CheckCircle2,
  User,
  Settings,
  Trash2,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
  LogIn,
} from "lucide-react";

export default function DashboardPage() {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [savedSchemes, setSavedSchemes] = useState<any[]>([]);
  const [checklistItems, setChecklistItems] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"saved" | "checklist" | "assessments" | "profile">("saved");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // 1. Current user
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);

        // If user logged in, fetch saved schemes and checklists
        if (userData.user) {
          const [savedRes, checkRes] = await Promise.all([
            fetch("/api/user/saved-schemes"),
            fetch("/api/user/checklist"),
          ]);

          if (savedRes.ok) {
            const data = await savedRes.json();
            setSavedSchemes(data.savedSchemes || []);
          }

          if (checkRes.ok) {
            const data = await checkRes.json();
            setChecklistItems(data.checklist || []);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (schemeId: string) => {
    try {
      await fetch(`/api/user/saved-schemes?schemeId=${schemeId}`, { method: "DELETE" });
      setSavedSchemes((prev) => prev.filter((s) => s.schemeId !== schemeId));
    } catch (e) {}
  };

  const handleToggleChecklist = async (schemeId: string, docName: string, currentVal: boolean) => {
    try {
      await fetch("/api/user/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemeId,
          documentName: docName,
          isPrepared: !currentVal,
        }),
      });

      setChecklistItems((prev) =>
        prev.map((item) =>
          item.schemeId === schemeId && item.documentName === docName
            ? { ...item, isPrepared: !currentVal }
            : item
        )
      );
    } catch (e) {}
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-navy-500">Loading your citizen dashboard...</p>
      </div>
    );
  }

  // If citizen is not logged in, show demo login prompt
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
        <h2 className="font-display font-bold text-xl text-navy-900">
          {language === "te" ? "డ్యాష్‌బోర్డ్ ప్రవేశం" : "Access Your Citizen Dashboard"}
        </h2>
        <p className="text-xs text-navy-600">
          {language === "te"
            ? "మీరు భద్రపరిచిన పథకాలు, మునుపటి అర్హత రికార్డులు మరియు డాక్యుమెంట్ ట్రాకర్‌ను చూడటానికి లాగిన్ అవ్వండి."
            : "Sign in or use our one-click demo citizen profile to save schemes and track required certificates."}
        </p>

        <div className="space-y-2 pt-2">
          <button
            onClick={async () => {
              const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isDemo: true, demoRole: "CITIZEN" }),
              });
              if (res.ok) {
                const data = await res.json();
                setCurrentUser(data.user);
                loadDashboardData();
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow transition"
          >
            {language === "te" ? "డెమో పౌరుడిగా కొనసాగండి (రమేష్ బాబు)" : "Continue as Demo Citizen (Ramesh Babu)"}
          </button>

          <a
            href="/login"
            className="block w-full py-2.5 px-4 rounded-xl border border-navy-200 text-navy-700 hover:bg-navy-50 font-semibold text-xs transition"
          >
            {t.navLogin}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Citizen Profile Banner */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white font-black text-xl flex items-center justify-center shadow-inner">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-display font-bold text-xl text-navy-900">{currentUser.name}</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-navy-500 mt-0.5">
              {currentUser.email} • {currentUser.state}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push("/assess")}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>{t.navAssess}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-navy-200 text-xs sm:text-sm font-semibold space-x-4">
        <button
          onClick={() => setActiveTab("saved")}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition ${
            activeTab === "saved"
              ? "border-teal-600 text-teal-800"
              : "border-transparent text-navy-500 hover:text-navy-900"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>{t.savedSchemes} ({savedSchemes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("checklist")}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition ${
            activeTab === "checklist"
              ? "border-teal-600 text-teal-800"
              : "border-transparent text-navy-500 hover:text-navy-900"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{t.myChecklist} ({checklistItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition ${
            activeTab === "profile"
              ? "border-teal-600 text-teal-800"
              : "border-transparent text-navy-500 hover:text-navy-900"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{language === "te" ? "ప్రొఫైల్ ప్రాధాన్యతలు" : "Preferences & Privacy"}</span>
        </button>
      </div>

      {/* Tab Content: Saved Schemes */}
      {activeTab === "saved" && (
        <div className="space-y-4">
          {savedSchemes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-navy-100 p-10 text-center space-y-3">
              <Bookmark className="w-8 h-8 text-navy-300 mx-auto" />
              <p className="text-xs text-navy-600">{t.noSavedSchemes}</p>
              <button
                onClick={() => router.push("/schemes")}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold"
              >
                {t.heroCtaExplore}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedSchemes.map((item) => {
                const s = item.scheme;
                let docs = [];
                try {
                  docs = JSON.parse(s.requiredDocsJson);
                } catch (e) {}

                const parsed = {
                  ...s,
                  requiredDocs: docs,
                  targetBeneficiaries: [],
                  verifiedDate: new Date(s.verifiedDate).toISOString(),
                };

                return (
                  <div key={item.id} className="relative">
                    <SchemeCard scheme={parsed} isSaved={true} onToggleSave={handleRemoveSaved} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Document Checklist */}
      {activeTab === "checklist" && (
        <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-100">
            <div>
              <h3 className="font-display font-bold text-base text-navy-900">{t.myChecklist}</h3>
              <p className="text-xs text-navy-500">
                {language === "te"
                  ? "మీరు దరఖాస్తు చేయాలనుకుంటున్న పథకాలకు సంబంధించిన ధృవీకరణ పత్రాల స్థితిని ఇక్కడ ట్రాక్ చేయవచ్చు."
                  : "Track document preparation readiness across all saved welfare applications."}
              </p>
            </div>
          </div>

          {checklistItems.length === 0 ? (
            <p className="text-xs text-navy-500 py-6 text-center">
              No documents currently marked in your checklist. Visit any scheme detail page to begin tracking.
            </p>
          ) : (
            <div className="space-y-2">
              {checklistItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    handleToggleChecklist(item.schemeId, item.documentName, item.isPrepared)
                  }
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                    item.isPrepared ? "bg-teal-50/70 border-teal-200" : "bg-white border-navy-200 hover:bg-navy-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <button type="button" className="text-teal-600">
                      {item.isPrepared ? (
                        <CheckCircle2 className="w-4 h-4 fill-teal-600 text-white" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-navy-400"></div>
                      )}
                    </button>
                    <div>
                      <span
                        className={`text-xs font-semibold ${
                          item.isPrepared ? "text-teal-950 line-through" : "text-navy-900"
                        }`}
                      >
                        {item.documentName}
                      </span>
                      {item.scheme && (
                        <p className="text-[11px] text-navy-500">
                          Scheme: {language === "te" ? item.scheme.titleTe : item.scheme.titleEn}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.isPrepared ? "bg-teal-100 text-teal-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.isPrepared ? t.docStatusPrepared : t.docStatusPending}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Profile Preferences & Privacy */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-navy-100 p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl">
          <h3 className="font-display font-bold text-base text-navy-900 border-b border-navy-100 pb-3">
            {language === "te" ? "వ్యక్తిగత ప్రాధాన్యతలు & గోప్యతా నియంత్రణలు" : "Profile Preferences & Privacy"}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1.5">
                {language === "te" ? "ప్రాథమిక భాష (Preferred Language)" : "Preferred Language"}
              </label>
              <div className="flex space-x-3">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border transition ${
                    language === "en"
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white text-navy-700 border-navy-200"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage("te")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border transition ${
                    language === "te"
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white text-navy-700 border-navy-200"
                  }`}
                >
                  తెలుగు (Telugu)
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-navy-100">
              <h4 className="text-xs font-bold text-navy-900 mb-1">
                {language === "te" ? "గోప్యత & డేటా రక్షణ" : "Privacy & Data Protection"}
              </h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                JanSetu complies with minimal data collection principles. We never request Aadhaar OTPs, bank passwords, or debit card credentials.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


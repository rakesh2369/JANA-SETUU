"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageContext";
import { Building2, ShieldCheck, ExternalLink, Phone, AlertCircle, Sparkles } from "lucide-react";

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-navy-950 text-navy-200 border-t border-navy-800 text-sm">
      {/* Disclaimer Banner */}
      <div className="bg-navy-900 border-b border-navy-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-start space-x-3 text-xs leading-relaxed text-navy-300">
          <AlertCircle className="w-5 h-5 text-saffron-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-saffron-300 block mb-1">
              {t.legalDisclaimerTitle}
            </span>
            <p>{t.legalDisclaimerText}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Platform Overview */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                {t.brandName}
              </span>
            </div>
            <p className="text-xs text-navy-300 leading-relaxed">
              {language === "te"
                ? "ఆంధ్రప్రదేశ్ ప్రజలకు ప్రభుత్వ సంక్షేమ పథకాలను సులభంగా చేరువ చేసే AI ఆధారిత సమాచార మార్గదర్శక వేదిక."
                : "A centralized, trustworthy digital platform simplifying discovery and document preparation for Andhra Pradesh public benefit schemes."}
            </p>
            <div className="flex items-center space-x-2 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Grounded in Official AP & GOI Portals</span>
            </div>
          </div>

          {/* Column 2: Official Portals */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {language === "te" ? "అధికారిక పోర్టల్ లింకులు" : "Official Government Portals"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://jnanabhumi.ap.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-teal-400 flex items-center space-x-1 transition"
                >
                  <span>Jnanabhumi (Education & RTF)</span>
                  <ExternalLink className="w-3 h-3 text-navy-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://ysrrythubharosa.ap.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-teal-400 flex items-center space-x-1 transition"
                >
                  <span>Rythu Bharosa (Agriculture)</span>
                  <ExternalLink className="w-3 h-3 text-navy-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://aarogyasri.ap.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-teal-400 flex items-center space-x-1 transition"
                >
                  <span>Dr. YSR Aarogyasri Trust</span>
                  <ExternalLink className="w-3 h-3 text-navy-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://navasakam.ap.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-teal-400 flex items-center space-x-1 transition"
                >
                  <span>Navasakam (Beneficiary Verification)</span>
                  <ExternalLink className="w-3 h-3 text-navy-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmvishwakarma.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-teal-400 flex items-center space-x-1 transition"
                >
                  <span>PM Vishwakarma Portal (GOI)</span>
                  <ExternalLink className="w-3 h-3 text-navy-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Helplines */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {language === "te" ? "ప్రజా హెల్ప్‌లైన్ నంబర్లు" : "Official Helplines"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <div>
                  <span className="font-semibold text-white">1902</span>
                  <p className="text-navy-400 text-[11px]">AP Spandana Citizen Helpline</p>
                </div>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <div>
                  <span className="font-semibold text-white">104</span>
                  <p className="text-navy-400 text-[11px]">24x7 Aarogyasri Medical Advice</p>
                </div>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <div>
                  <span className="font-semibold text-white">155251</span>
                  <p className="text-navy-400 text-[11px]">Rythu Bharosa Kendra Helpline</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Explainable AI & Transparency */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {language === "te" ? "విశ్వసనీయత & సాంకేతికత" : "Explainability & Tech"}
            </h4>
            <p className="text-xs text-navy-300 leading-relaxed mb-3">
              JanSetu employs deterministic rule evaluation alongside retrieval-grounded generative AI to eliminate hallucinations and present verifiable facts.
            </p>
            <div className="p-2.5 rounded bg-navy-900 border border-navy-800 text-xs">
              <span className="text-teal-300 font-semibold flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bilingual RAG Engine</span>
              </span>
              <p className="text-[11px] text-navy-400 mt-1">
                Grounded responses with source attribution in Telugu and English.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-navy-800 text-xs text-navy-400 flex flex-col sm:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} JanSetu Public Benefit Platform. Open public welfare discovery.</p>
          <p className="mt-2 sm:mt-0 text-[11px] text-navy-400">
            Designed for Citizens of Andhra Pradesh & Bharat • Data updated January 2025
          </p>
        </div>
      </div>
    </footer>
  );
}

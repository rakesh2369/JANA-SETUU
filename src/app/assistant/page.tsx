"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageContext";
import AssistantChat from "@/components/AssistantChat";
import { Bot, ShieldCheck, Sparkles, MessageSquare } from "lucide-react";

export default function AssistantPage() {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === "te" ? "ఏఐ సంభాషణ మార్గదర్శి" : "AI Welfare Dialogue"}</span>
        </div>
        <h1 className="font-display font-black text-2xl sm:text-4xl text-navy-900">
          {t.aiAssistantTitle}
        </h1>
        <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
          {t.aiAssistantSubtitle}
        </p>
      </div>

      {/* Embedded Assistant */}
      <AssistantChat />
    </div>
  );
}


"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { SchemeItem } from "@/types/scheme";
import SchemeCard from "@/components/SchemeCard";
import AssistantChat from "@/components/AssistantChat";
import {
  GraduationCap,
  Tractor,
  HeartHandshake,
  Users,
  ShieldCheck,
  Building2,
  FileCheck2,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  Compass,
  HeartPulse,
  Home,
  Briefcase,
} from "lucide-react";

export default function HomePage() {
  const { language, t } = useLanguage();
  const [schemes, setSchemes] = useState<SchemeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/schemes")
      .then((res) => res.json())
      .then((data) => {
        if (data.schemes) setSchemes(data.schemes);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    {
      titleEn: "Education & Scholarships",
      titleTe: "విద్య & స్కాలర్‌షిప్‌లు",
      descEn: "Vidya Deevena, Vasathi Deevena, Amma Vodi",
      descTe: "విద్యా దీవెన, వసతి దీవెన, అమ్మ ఒడి",
      icon: GraduationCap,
      href: "/schemes?category=Education",
      color: "from-blue-600 to-indigo-700",
      accent: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      titleEn: "Agriculture & Subsidies",
      titleTe: "వ్యవసాయం & రాయితీలు",
      descEn: "Rythu Bharosa, Zero-Interest Loans, Free Insurance",
      descTe: "రైతు భరోసా, సున్నా వడ్డీ పంట రుణాలు, బీమా",
      icon: Tractor,
      href: "/schemes?category=Agriculture",
      color: "from-emerald-600 to-teal-700",
      accent: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      titleEn: "Women Empowerment",
      titleTe: "మహిళా సంక్షేమం & చేయూత",
      descEn: "YSR Cheyutha, YSR Aasara, SHG Enterprise Loans",
      descTe: "చేయూత, ఆసరా, డ్వాక్రా రుణాల మాఫీ",
      icon: HeartHandshake,
      href: "/schemes?category=Women%20Welfare",
      color: "from-purple-600 to-pink-700",
      accent: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      titleEn: "Pensions & Social Security",
      titleTe: "పింఛన్లు & సామాజిక భద్రత",
      descEn: "YSR Pension Kanuka (OAP, Widow, PwD)",
      descTe: "వైఎస్సార్ పెన్షన్ కానుక, వృద్ధాప్య & వితంతు",
      icon: Users,
      href: "/schemes?category=Pensions%20%26%20Social%20Security",
      color: "from-amber-600 to-orange-700",
      accent: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      titleEn: "Free Healthcare",
      titleTe: "ఉచిత వైద్యం (ఆరోగ్యశ్రీ)",
      descEn: "Cashless coverage up to ₹25 Lakhs in top hospitals",
      descTe: "రూ. 25 లక్షల వరకు నగదు రహిత సూపర్ స్పెషాలిటీ వైద్యం",
      icon: HeartPulse,
      href: "/schemes?category=Healthcare",
      color: "from-rose-600 to-red-700",
      accent: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      titleEn: "Artisans & Housing",
      titleTe: "చేతివృత్తులు & గృహ నిర్మాణం",
      descEn: "PM Vishwakarma, YSR Pedalandariki Illu, Chedodu",
      descTe: "పీఎం విశ్వకర్మ, పేదలందరికీ ఇళ్లు, చేదోడు",
      icon: Home,
      href: "/schemes?category=Housing",
      color: "from-teal-600 to-cyan-700",
      accent: "bg-teal-50 text-teal-700 border-teal-200",
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-navy-900 via-navy-900 to-navy-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>{t.heroBadge}</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {t.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-navy-200 leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <a
              href="/assess"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-teal-600/30 transition flex items-center justify-center space-x-2"
            >
              <FileCheck2 className="w-5 h-5" />
              <span>{t.heroCtaAssess}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="/schemes"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-navy-800/80 hover:bg-navy-800 text-navy-100 hover:text-white border border-navy-700 font-semibold text-sm sm:text-base transition flex items-center justify-center space-x-2"
            >
              <Compass className="w-5 h-5 text-teal-400" />
              <span>{t.heroCtaExplore}</span>
            </a>
          </div>

          {/* Stat counters */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-navy-800/80">
            <div className="p-3">
              <span className="block font-display font-black text-2xl sm:text-3xl text-teal-400">10+</span>
              <span className="text-xs text-navy-300">
                {language === "te" ? "ప్రధాన సంక్షేమ పథకాలు" : "Verified Flagship Schemes"}
              </span>
            </div>
            <div className="p-3">
              <span className="block font-display font-black text-2xl sm:text-3xl text-teal-400">100%</span>
              <span className="text-xs text-navy-300">
                {language === "te" ? "నిర్ధారిత అధికారిక మూలాలు" : "Grounded Public Data"}
              </span>
            </div>
            <div className="p-3">
              <span className="block font-display font-black text-2xl sm:text-3xl text-teal-400">2 Languages</span>
              <span className="text-xs text-navy-300">
                {language === "te" ? "తెలుగు & ఇంగ్లీష్ మద్దతు" : "Telugu & English Interface"}
              </span>
            </div>
            <div className="p-3">
              <span className="block font-display font-black text-2xl sm:text-3xl text-teal-400">Deterministic</span>
              <span className="text-xs text-navy-300">
                {language === "te" ? "పారదర్శక అర్హత నియమాలు" : "Explainable Rule Engine"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy-900">
            {language === "te" ? "విభాగాల వారీగా పథకాలు" : "Browse by Target Welfare Category"}
          </h2>
          <p className="text-xs sm:text-sm text-navy-600 mt-2">
            {language === "te"
              ? "మీ అవసరాలకు తగిన విభాగాన్ని ఎంచుకుని, వర్తించే సంక్షేమ పథకాలు మరియు డాక్యుమెంట్లను పరిశీలించండి."
              : "Discover schemes designed for students, farmers, women, elderly citizens, and artisans."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const title = language === "te" ? cat.titleTe : cat.titleEn;
            const desc = language === "te" ? cat.descTe : cat.descEn;

            return (
              <a
                key={idx}
                href={cat.href}
                className="bg-white rounded-2xl border border-navy-100 p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between hover:border-teal-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-navy-50 group-hover:bg-teal-50 flex items-center justify-center text-teal-700 transition mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-base text-navy-900 group-hover:text-teal-700 transition">
                    {title}
                  </h3>
                  <p className="text-xs text-navy-600 mt-1.5 leading-relaxed">{desc}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-navy-50 flex items-center justify-between text-xs font-semibold text-teal-700">
                  <span>{language === "te" ? "పథకాలను చూడండి" : "Explore Schemes"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* How JanSetu Works - 4 Step Explainability */}
      <section className="bg-ivory-100 border-y border-ivory-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-teal-700 font-bold">
              {language === "te" ? "నాలుగు సులభమైన దశలు" : "Simple 4-Step Process"}
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy-900 mt-1">
              {language === "te"
                ? "జనసేతు ద్వారా పథకాలను ఎలా తెలుసుకోవాలి?"
                : "How Citizens Use JanSetu"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-xs relative">
              <span className="font-display text-4xl font-black text-teal-600/20 absolute top-4 right-4">01</span>
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-3">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-navy-900">
                {language === "te" ? "1. పథకాల శోధన" : "1. Discover Schemes"}
              </h4>
              <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                {language === "te"
                  ? "కీవర్డ్ లేదా విభాగం ద్వారా ఆంధ్రప్రదేశ్ మరియు కేంద్ర ప్రభుత్వ పథకాలను వెతకండి."
                  : "Search our verified database by keyword, department, or beneficiary category."}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-xs relative">
              <span className="font-display text-4xl font-black text-teal-600/20 absolute top-4 right-4">02</span>
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-3">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-navy-900">
                {language === "te" ? "2. అర్హత అంచనా" : "2. Check Eligibility"}
              </h4>
              <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                {language === "te"
                  ? "వయస్సు, ఆదాయం, సామాజిక వర్గ వివరాలు నమోదు చేసి పారదర్శక అర్హత గణన పొందండి."
                  : "Input your socio-economic details into our deterministic rule engine for an explainable score."}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-xs relative">
              <span className="font-display text-4xl font-black text-teal-600/20 absolute top-4 right-4">03</span>
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-navy-900">
                {language === "te" ? "3. పత్రాల సన్నద్ధత" : "3. Prepare Checklist"}
              </h4>
              <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                {language === "te"
                  ? "సచివాలయం లేదా మీసేవ కేంద్రంలో దరఖాస్తుకు ముందే అవసరమైన పత్రాలను సిద్ధం చేసుకోండి."
                  : "Track each required document with guidance on where to obtain it (Sachivalayam, MeeSeva, Meebhoomi)."}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-xs relative">
              <span className="font-display text-4xl font-black text-teal-600/20 absolute top-4 right-4">04</span>
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-navy-900">
                {language === "te" ? "4. అధికారిక దరఖాస్తు" : "4. Official Application"}
              </h4>
              <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                {language === "te"
                  ? "నేరుగా అధికారిక ప్రభుత్వ పోర్టల్ లేదా సచివాలయంలో ఎటువంటి మధ్యవర్తులు లేకుండా దరఖాస్తు చేయండి."
                  : "Proceed directly to the official government portal or local secretariat with verified confidence."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Schemes Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy-900">
              {language === "te" ? "ప్రధాన సంక్షేమ పథకాలు" : "Featured Welfare Programmes"}
            </h2>
            <p className="text-xs sm:text-sm text-navy-600 mt-1">
              {language === "te"
                ? "ఆంధ్రప్రదేశ్ ప్రభుత్వం అమలు చేస్తున్న అత్యంత ప్రాధాన్యత గల సంక్షేమ పథకాలు."
                : "High-priority welfare and subsidy programmes verified against departmental guidelines."}
            </p>
          </div>

          <a
            href="/schemes"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            <span>{t.heroCtaExplore}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-xl bg-navy-100 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.slice(0, 6).map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </section>

      {/* Embedded AI Assistant Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-teal-100 text-teal-800">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{language === "te" ? "తెలుగు & ఇంగ్లీష్ మద్దతు" : "Bilingual AI Assistant"}</span>
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy-900 leading-snug">
              {language === "te"
                ? "పథకాల గురించిన ప్రశ్నలకు తక్షణ, అధికారిక సమాధానాలు"
                : "Ask Anything About AP Government Schemes"}
            </h2>

            <p className="text-sm text-navy-600 leading-relaxed">
              {language === "te"
                ? "జనసేతు ఏఐ అసిస్టెంట్ ప్రభుత్వ మార్గదర్శకాలను సులభమైన భాషలో వివరిస్తుంది. అర్హతలు, అవసరమైన పత్రాలు, మరియు దరఖాస్తు దశల గురించి తెలుగు లేదా ఇంగ్లీషులో ప్రశ్నించండి."
                : "Have questions about eligibility, required documents, or application channels? Our AI assistant retrieves verified scheme information and provides grounded answers with official portal references."}
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-start space-x-2 text-xs text-navy-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <span>
                  {language === "te"
                    ? "నిర్ధారిత రికార్డుల ఆధారంగా మాత్రమే సమాధానాలు (కల్పిత సమాచారం ఉండదు)"
                    : "Zero hallucinations: strictly grounded in verified departmental data."}
                </span>
              </div>
              <div className="flex items-start space-x-2 text-xs text-navy-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <span>
                  {language === "te"
                    ? "ప్రతి సమాధానానికి అధికారిక పోర్టల్ మరియు హెల్ప్‌లైన్ ఆధారాలు"
                    : "Direct citations linking to official government websites and helplines."}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <AssistantChat />
          </div>
        </div>
      </section>
    </div>
  );
}


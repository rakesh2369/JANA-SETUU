"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { SchemeItem } from "@/types/scheme";
import SchemeCard from "@/components/SchemeCard";
import SchemeFilter from "@/components/SchemeFilter";
import { Compass, RefreshCw, AlertCircle } from "lucide-react";

function SchemesContent() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();

  const [schemes, setSchemes] = useState<SchemeItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "ALL");
  const [level, setLevel] = useState(searchParams.get("level") || "ALL");
  const [beneficiary, setBeneficiary] = useState(searchParams.get("beneficiary") || "ALL");

  useEffect(() => {
    fetchSchemes();
  }, [category, level, beneficiary]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && category !== "ALL") params.append("category", category);
      if (level && level !== "ALL") params.append("level", level);
      if (beneficiary && beneficiary !== "ALL") params.append("beneficiary", beneficiary);

      const res = await fetch(`/api/schemes?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSchemes(data.schemes || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Client-side search keyword filtering
  const filteredSchemes = schemes.filter((s) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    const text = [
      s.titleEn,
      s.titleTe,
      s.descriptionEn,
      s.descriptionTe,
      s.benefitsEn,
      s.benefitsTe,
      s.departmentEn,
      s.departmentTe,
      s.category,
      s.targetBeneficiaries.join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return text.includes(query);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>{language === "te" ? "ప్రజా సంక్షేమ పథకాల నిధి" : "Verified Public Benefits Directory"}</span>
        </div>
        <h1 className="font-display font-black text-2xl sm:text-4xl text-navy-900">
          {language === "te" ? "ప్రభుత్వ సంక్షేమ పథకాల శోధన" : "Discover Government Schemes"}
        </h1>
        <p className="text-xs sm:text-sm text-navy-600 mt-1 max-w-3xl">
          {language === "te"
            ? "ఆంధ్రప్రదేశ్ మరియు కేంద్ర ప్రభుత్వ అధికారిక మార్గదర్శకాల ప్రకారం సరిచూసిన సంక్షేమ పథకాలను అన్వేషించండి."
            : "Browse verified government welfare programmes across Andhra Pradesh and Central India with accurate eligibility, benefits, and required document details."}
        </p>
      </div>

      {/* Filter Component */}
      <SchemeFilter
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        level={level}
        onLevelChange={setLevel}
        beneficiary={beneficiary}
        onBeneficiaryChange={setBeneficiary}
        totalCount={filteredSchemes.length}
      />

      {/* Schemes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-white rounded-xl border border-navy-100 p-6 animate-pulse">
              <div className="h-4 w-24 bg-navy-100 rounded mb-4"></div>
              <div className="h-6 w-3/4 bg-navy-200 rounded mb-3"></div>
              <div className="h-3 w-1/2 bg-navy-100 rounded mb-4"></div>
              <div className="h-16 bg-navy-50 rounded mb-4"></div>
            </div>
          ))}
        </div>
      ) : filteredSchemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-navy-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-navy-50 text-navy-500 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-navy-900">
            {language === "te" ? "ఎలాంటి పథకాలు కనుగొనబడలేదు" : "No Matching Schemes Found"}
          </h3>
          <p className="text-xs text-navy-600">
            {language === "te"
              ? "మీరు ఎంచుకున్న శోధన పదాలు లేదా ఫిల్టర్లకు సరిపోయే పథకాలు లేవు. దయచేసి ఫిల్టర్లను తొలగించి మళ్లీ ప్రయత్నించండి."
              : "No schemes match your selected search keywords or filter criteria. Try resetting filters or using a broader query."}
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("ALL");
              setLevel("ALL");
              setBeneficiary("ALL");
            }}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === "te" ? "ఫిల్టర్లు తొలగించండి" : "Reset All Filters"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function SchemesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-navy-500">Loading catalog...</div>}>
      <SchemesContent />
    </Suspense>
  );
}

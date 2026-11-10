"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageContext";
import { Search, X, Filter } from "lucide-react";

interface SchemeFilterProps {
  search: string;
  onSearchChange: (val: string) => void;
  category: string;
  onCategoryChange: (cat: string) => void;
  level: string;
  onLevelChange: (lvl: string) => void;
  beneficiary: string;
  onBeneficiaryChange: (ben: string) => void;
  totalCount: number;
}

export default function SchemeFilter({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  level,
  onLevelChange,
  beneficiary,
  onBeneficiaryChange,
  totalCount,
}: SchemeFilterProps) {
  const { language, t } = useLanguage();

  const categories = [
    { id: "ALL", label: t.filterAll },
    { id: "Education", label: t.filterEducation },
    { id: "Agriculture", label: t.filterAgriculture },
    { id: "Women Welfare", label: t.filterWomen },
    { id: "Pensions & Social Security", label: t.filterPensions },
    { id: "Healthcare", label: t.filterHealthcare },
    { id: "Housing", label: t.filterHousing },
    { id: "Employment & Skills", label: t.filterEmployment },
    { id: "Welfare", label: t.filterWelfare },
  ];

  const beneficiaries = [
    { id: "ALL", label: language === "te" ? "అందరూ" : "All Citizens" },
    { id: "Students", label: language === "te" ? "విద్యార్థులు" : "Students" },
    { id: "Farmers", label: language === "te" ? "రైతులు" : "Farmers" },
    { id: "Women", label: language === "te" ? "మహిళలు" : "Women" },
    { id: "Senior Citizens", label: language === "te" ? "వృద్ధులు" : "Senior Citizens" },
    { id: "Artisans", label: language === "te" ? "చేతివృత్తుల వారు" : "Artisans & Craftsmen" },
  ];

  return (
    <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-sm space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-10 py-3 text-sm rounded-lg border border-navy-200 bg-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-navy-900"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div>
        <div className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-teal-600" />
            <span>{language === "te" ? "పథకాల విభాగాలు" : "Scheme Categories"}</span>
          </span>
          <span className="text-navy-400 font-normal">
            {totalCount} {language === "te" ? "పథకాలు కనుగొనబడ్డాయి" : "Schemes Found"}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onCategoryChange(c.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${
                category === c.id
                  ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                  : "bg-navy-50 text-navy-700 border-navy-200 hover:bg-navy-100"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Level and Beneficiary Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-navy-100">
        {/* State vs Central */}
        <div>
          <label className="block text-xs font-semibold text-navy-600 mb-1.5">
            {language === "te" ? "పరిపాలనా స్థాయి" : "Government Level"}
          </label>
          <div className="grid grid-cols-3 gap-1 bg-navy-50 p-1 rounded-lg border border-navy-200 text-xs">
            <button
              onClick={() => onLevelChange("ALL")}
              className={`py-1 rounded font-medium transition ${
                level === "ALL" ? "bg-white text-navy-900 shadow-xs" : "text-navy-600 hover:text-navy-900"
              }`}
            >
              {t.allLevels}
            </button>
            <button
              onClick={() => onLevelChange("State")}
              className={`py-1 rounded font-medium transition ${
                level === "State" ? "bg-white text-teal-700 shadow-xs" : "text-navy-600 hover:text-navy-900"
              }`}
            >
              Andhra Pradesh
            </button>
            <button
              onClick={() => onLevelChange("Central")}
              className={`py-1 rounded font-medium transition ${
                level === "Central" ? "bg-white text-saffron-700 shadow-xs" : "text-navy-600 hover:text-navy-900"
              }`}
            >
              Central (GOI)
            </button>
          </div>
        </div>

        {/* Target Beneficiaries */}
        <div>
          <label className="block text-xs font-semibold text-navy-600 mb-1.5">
            {t.targetBeneficiary}
          </label>
          <div className="flex flex-wrap gap-1">
            {beneficiaries.map((b) => (
              <button
                key={b.id}
                onClick={() => onBeneficiaryChange(b.id)}
                className={`text-[11px] px-2.5 py-1 rounded border transition ${
                  beneficiary === b.id
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-navy-600 border-navy-200 hover:bg-navy-50"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import { SchemeItem } from "@/types/scheme";
import { useLanguage } from "@/components/LanguageContext";
import {
  ShieldCheck,
  Calendar,
  Building2,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  ExternalLink,
  FileText,
  CheckCircle,
} from "lucide-react";

interface SchemeCardProps {
  scheme: SchemeItem;
  isSaved?: boolean;
  onToggleSave?: (schemeId: string) => void;
}

export default function SchemeCard({ scheme, isSaved = false, onToggleSave }: SchemeCardProps) {
  const { language, t } = useLanguage();
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  const title = language === "te" ? scheme.titleTe : scheme.titleEn;
  const description = language === "te" ? scheme.descriptionTe : scheme.descriptionEn;
  const benefits = language === "te" ? scheme.benefitsTe : scheme.benefitsEn;
  const department = language === "te" ? scheme.departmentTe : scheme.departmentEn;

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;

    setSaving(true);
    try {
      if (saved) {
        await fetch(`/api/user/saved-schemes?schemeId=${scheme.id}`, { method: "DELETE" });
        setSaved(false);
      } else {
        await fetch("/api/user/saved-schemes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schemeId: scheme.id }),
        });
        setSaved(true);
      }
      if (onToggleSave) onToggleSave(scheme.id);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Education":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Agriculture":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Women Welfare":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "Pensions & Social Security":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Healthcare":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "Housing":
        return "bg-orange-50 text-orange-800 border-orange-200";
      case "Employment & Skills":
        return "bg-cyan-50 text-cyan-800 border-cyan-200";
      default:
        return "bg-teal-50 text-teal-800 border-teal-200";
    }
  };

  const formattedDate = new Date(scheme.verifiedDate).toLocaleDateString(
    language === "te" ? "te-IN" : "en-IN",
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <div className="bg-white rounded-xl border border-navy-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-5 sm:p-6">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-1.5">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                scheme.category
              )}`}
            >
              {scheme.category}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-navy-50 text-navy-700 border border-navy-200">
              {scheme.level === "State" ? "Andhra Pradesh" : "Central (GOI)"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {scheme.isVerified && (
              <span className="inline-flex items-center space-x-1 text-[11px] text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>{t.verifiedBadge}</span>
              </span>
            )}
            <button
              onClick={handleBookmark}
              disabled={saving}
              title={saved ? "Remove bookmark" : "Save scheme"}
              className={`p-1.5 rounded-md transition ${
                saved
                  ? "text-saffron-600 bg-saffron-50 hover:bg-saffron-100"
                  : "text-navy-400 hover:text-navy-700 hover:bg-navy-50"
              }`}
            >
              {saved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-lg text-navy-900 group-hover:text-teal-700 transition leading-snug mb-1.5">
          <a href={`/schemes/${scheme.slug}`}>{title}</a>
        </h3>

        {/* Department */}
        <div className="flex items-center space-x-1.5 text-xs text-navy-500 mb-3">
          <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-navy-400" />
          <span className="line-clamp-1">{department}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-navy-600 leading-relaxed line-clamp-2 mb-4">
          {description}
        </p>

        {/* Benefits Box */}
        <div className="bg-ivory-100 rounded-lg p-3 border border-ivory-300 text-xs text-navy-800 mb-4">
          <div className="font-semibold text-navy-900 flex items-center space-x-1 mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>{language === "te" ? "ప్రధాన ప్రయోజనం:" : "Core Benefit:"}</span>
          </div>
          <p className="line-clamp-2 text-navy-700">{benefits}</p>
        </div>

        {/* Metadata info */}
        <div className="flex items-center justify-between text-[11px] text-navy-400 pt-2 border-t border-navy-50">
          <span className="flex items-center space-x-1">
            <FileText className="w-3 h-3 text-navy-400" />
            <span>
              {scheme.requiredDocs.length} {language === "te" ? "డాక్యుమెంట్లు" : "Docs Required"}
            </span>
          </span>
          <span className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-navy-400" />
            <span>{t.verifiedOn} {formattedDate}</span>
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 py-3 bg-navy-50 border-t border-navy-100 flex items-center justify-between">
        <a
          href={`/schemes/${scheme.slug}`}
          className="text-xs font-semibold text-navy-800 hover:text-teal-700 flex items-center space-x-1 transition"
        >
          <span>{t.viewDetails}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>

        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-teal-700 hover:text-teal-800 font-medium flex items-center space-x-1"
        >
          <span>{scheme.portalName.split(" ")[0]}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}


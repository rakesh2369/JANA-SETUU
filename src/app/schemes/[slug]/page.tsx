"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { SchemeItem } from "@/types/scheme";
import DocumentChecklistTracker from "@/components/DocumentChecklistTracker";
import {
  ShieldCheck,
  Building2,
  Calendar,
  ExternalLink,
  FileCheck2,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  HelpCircle,
  Info,
} from "lucide-react";

export default function SchemeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const slug = params?.slug as string;

  const [scheme, setScheme] = useState<SchemeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/schemes/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.scheme) setScheme(data.scheme);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-navy-600">Loading scheme details...</p>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-navy-900">Scheme Not Found</h2>
        <p className="text-sm text-navy-600">
          The requested scheme could not be located in our verified directory.
        </p>
        <button
          onClick={() => router.push("/schemes")}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium"
        >
          Back to Schemes Catalog
        </button>
      </div>
    );
  }

  const title = language === "te" ? scheme.titleTe : scheme.titleEn;
  const description = language === "te" ? scheme.descriptionTe : scheme.descriptionEn;
  const benefits = language === "te" ? scheme.benefitsTe : scheme.benefitsEn;
  const eligibility = language === "te" ? scheme.eligibilitySummaryTe : scheme.eligibilitySummaryEn;
  const department = language === "te" ? scheme.departmentTe : scheme.departmentEn;
  const applicationProcess = language === "te" ? scheme.applicationProcessTe : scheme.applicationProcessEn;

  const formattedDate = new Date(scheme.verifiedDate).toLocaleDateString(
    language === "te" ? "te-IN" : "en-IN",
    { month: "long", day: "numeric", year: "numeric" }
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-navy-600 hover:text-teal-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === "te" ? "పథకాల జాబితాకు తిరిగి వెళ్లండి" : "Back to All Schemes"}</span>
      </button>

      {/* Scheme Hero Header Card */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {scheme.category}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded bg-navy-50 text-navy-700 border border-navy-200">
              {scheme.level === "State" ? "Andhra Pradesh State Scheme" : "Central Scheme"}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs text-navy-500">
            <span className="inline-flex items-center space-x-1 text-teal-700 font-semibold bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>{t.verifiedBadge}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-navy-400" />
              <span>Verified: {formattedDate}</span>
            </span>
          </div>
        </div>

        <h1 className="font-display font-black text-2xl sm:text-3xl text-navy-900 leading-tight">
          {title}
        </h1>

        <div className="flex items-center space-x-2 text-xs sm:text-sm text-navy-600">
          <Building2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span className="font-medium">{department}</span>
        </div>

        <p className="text-sm text-navy-700 leading-relaxed pt-2 border-t border-navy-50">
          {description}
        </p>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-navy-100">
          <a
            href={`/assess`}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm transition shadow-sm"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{t.checkEligibility}</span>
          </a>

          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs sm:text-sm transition shadow-sm"
          >
            <span>{language === "te" ? "అధికారిక పోర్టల్ సందర్శించండి" : "Visit Official Portal"}</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          {scheme.helpline && (
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-navy-50 border border-navy-200 text-xs text-navy-700">
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span className="font-medium">Helpline:</span>
              <span className="font-bold text-navy-900">{scheme.helpline}</span>
            </div>
          )}

          {scheme.deadline && (
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-semibold">{scheme.deadline}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Benefits & Eligibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Benefits Card */}
        <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-teal-700 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
            <h3 className="font-display text-base text-navy-900">
              {language === "te" ? "పథకం ద్వారా లభించే ప్రయోజనాలు" : "Detailed Benefits & Entitlements"}
            </h3>
          </div>
          <div className="text-xs sm:text-sm text-navy-700 leading-relaxed whitespace-pre-line bg-teal-50/40 p-4 rounded-xl border border-teal-100">
            {benefits}
          </div>
        </div>

        {/* Eligibility Criteria Card */}
        <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-navy-800 font-bold text-sm">
            <FileCheck2 className="w-5 h-5 text-navy-700" />
            <h3 className="font-display text-base text-navy-900">
              {language === "te" ? "ప్రచురితమైన అర్హత నిబంధనలు" : "Published Eligibility Rules"}
            </h3>
          </div>
          <div className="text-xs sm:text-sm text-navy-700 leading-relaxed whitespace-pre-line bg-navy-50/60 p-4 rounded-xl border border-navy-100">
            {eligibility}
          </div>
        </div>
      </div>

      {/* Interactive Document Checklist Component */}
      <DocumentChecklistTracker
        schemeId={scheme.id}
        schemeTitle={title}
        documents={scheme.requiredDocs}
      />

      {/* Official Application Procedure */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-lg text-navy-900 flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-teal-600" />
          <span>
            {language === "te" ? "దరఖాస్తు విధానం & అధికారిక దశలు" : "Official Application Procedure"}
          </span>
        </h3>
        <p className="text-xs text-navy-500">
          {language === "te"
            ? "ఈ పథకానికి దరఖాస్తు చేసుకోవడానికి క్రింది అధికారిక మార్గదర్శకాలను అనుసరించండి."
            : "Step-by-step instructions for submitting your application through designated government channels."}
        </p>

        <div className="bg-navy-50 p-5 rounded-xl border border-navy-100 text-xs sm:text-sm text-navy-800 leading-relaxed whitespace-pre-line">
          {applicationProcess}
        </div>

        <div className="p-4 rounded-xl bg-ivory-100 border border-ivory-300 flex items-start space-x-3 text-xs text-navy-700">
          <Info className="w-4 h-4 text-saffron-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-navy-900 block mb-0.5">
              {language === "te" ? "ముఖ్య గమనిక:" : "Government Process Transparency Note:"}
            </span>
            <p>
              {language === "te"
                ? "ఎల్లప్పుడూ మీ దరఖాస్తును సంబంధిత గ్రామ/వార్డు సచివాలయంలో లేదా అధికారిక పోర్టల్ ద్వారా మాత్రమే సమర్పించండి. JanSetu ఎవరి వద్ద నుండి డబ్బులు లేదా ఆధార్ బయోమెట్రిక్ వివరాలు సేకరించదు."
                : "Always submit applications directly through the official state portal or your local Grama/Ward Sachivalayam. JanSetu never requests payment, bank credentials, or biometric authentication."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { DocumentItem } from "@/types/scheme";
import { useLanguage } from "@/components/LanguageContext";
import {
  CheckCircle2,
  Circle,
  MapPin,
  FileText,
  Printer,
  Sparkles,
  ExternalLink,
  Info,
} from "lucide-react";

interface DocumentChecklistTrackerProps {
  schemeId: string;
  schemeTitle: string;
  documents: DocumentItem[];
}

export default function DocumentChecklistTracker({
  schemeId,
  schemeTitle,
  documents,
}: DocumentChecklistTrackerProps) {
  const { language, t } = useLanguage();
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [notesState, setNotesState] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChecklist();
  }, [schemeId]);

  const loadChecklist = async () => {
    try {
      // First try localStorage
      const localKey = `jansetu_checklist_${schemeId}`;
      const localSaved = localStorage.getItem(localKey);
      if (localSaved) {
        setChecklistState(JSON.parse(localSaved));
      }

      // Sync with user's remote checklist if logged in
      const res = await fetch(`/api/user/checklist?schemeId=${schemeId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.checklist && data.checklist.length > 0) {
          const remoteState: Record<string, boolean> = {};
          const remoteNotes: Record<string, string> = {};
          data.checklist.forEach((item: any) => {
            remoteState[item.documentName] = item.isPrepared;
            if (item.notes) remoteNotes[item.documentName] = item.notes;
          });
          setChecklistState((prev) => ({ ...prev, ...remoteState }));
          setNotesState(remoteNotes);
        }
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const toggleDocument = async (docName: string) => {
    const newState = !checklistState[docName];
    const updated = { ...checklistState, [docName]: newState };
    setChecklistState(updated);

    // Persist locally
    localStorage.setItem(`jansetu_checklist_${schemeId}`, JSON.stringify(updated));

    // Persist to server if logged in
    try {
      await fetch("/api/user/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemeId,
          documentName: docName,
          isPrepared: newState,
        }),
      });
    } catch (e) {}
  };

  const preparedCount = documents.filter((d) => checklistState[d.nameEn]).length;
  const progressPercent = Math.round((preparedCount / (documents.length || 1)) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl border border-navy-100 p-6 shadow-sm">
      {/* Header and Print Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-navy-100 gap-3">
        <div>
          <h3 className="font-display font-bold text-lg text-navy-900 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <span>{t.docTitle}</span>
          </h3>
          <p className="text-xs text-navy-500 mt-0.5">{t.docSubtitle}</p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-navy-200 text-xs font-medium text-navy-700 hover:bg-navy-50 transition self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{language === "te" ? "ప్రింట్ తీసుకోండి" : "Print Checklist"}</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="my-5 p-4 rounded-xl bg-ivory-100 border border-ivory-300">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-navy-800">
            {language === "te" ? "డాక్యుమెంట్ ప్రిపరేషన్ స్థితి:" : "Document Readiness Progress:"}
          </span>
          <span className="font-bold text-teal-700">
            {preparedCount} / {documents.length} ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-navy-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-teal-700 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        {progressPercent === 100 && (
          <p className="text-xs text-teal-800 font-medium mt-2 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>
              {language === "te"
                ? "అద్భుతం! మీ వద్ద అవసరమైన అన్ని ధృవీకరణ పత్రాలు సిద్ధంగా ఉన్నాయి. మీరు ఇప్పుడు దరఖాస్తు చేసుకోవచ్చు."
                : "Great! All required documents are marked ready. You can proceed with official application submission."}
            </span>
          </p>
        )}
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {documents.map((doc, index) => {
          const isPrepared = !!checklistState[doc.nameEn];
          const name = language === "te" ? doc.nameTe : doc.nameEn;
          const desc = language === "te" ? doc.descriptionTe : doc.descriptionEn;
          const where = language === "te" ? doc.whereToGetTe : doc.whereToGetEn;

          return (
            <div
              key={doc.id || index}
              onClick={() => toggleDocument(doc.nameEn)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start space-x-3.5 ${
                isPrepared
                  ? "bg-teal-50/60 border-teal-200"
                  : "bg-white hover:bg-navy-50/50 border-navy-200"
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-teal-600 flex-shrink-0"
                aria-label={isPrepared ? "Mark pending" : "Mark prepared"}
              >
                {isPrepared ? (
                  <CheckCircle2 className="w-5 h-5 fill-teal-600 text-white" />
                ) : (
                  <Circle className="w-5 h-5 text-navy-400 hover:text-teal-600" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm font-semibold ${
                        isPrepared ? "text-teal-950 line-through decoration-teal-600" : "text-navy-900"
                      }`}
                    >
                      {name}
                    </span>
                    {doc.isRequired ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                        {language === "te" ? "తప్పనిసరి" : "Mandatory"}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-navy-500 bg-navy-100 px-1.5 py-0.5 rounded">
                        {language === "te" ? "ఐచ్ఛికం" : "Optional"}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-navy-400 bg-white px-2 py-0.5 rounded border border-navy-100">
                    {doc.category}
                  </span>
                </div>

                <p className="text-xs text-navy-600 mb-2">{desc}</p>

                <div className="flex items-center space-x-1.5 text-xs text-navy-500 bg-white/80 p-2 rounded-lg border border-navy-100">
                  <MapPin className="w-3.5 h-3.5 text-saffron-600 flex-shrink-0" />
                  <span className="font-medium text-navy-700">
                    {language === "te" ? "ఎక్కడ పొందాలి:" : "Where to Obtain:"}
                  </span>
                  <span className="text-navy-600 truncate">{where}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


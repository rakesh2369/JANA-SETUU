"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { AssessmentResult, UserProfileInput } from "@/types/scheme";
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Award,
  Sparkles,
} from "lucide-react";

export default function AssessmentPage() {
  const { language, t } = useLanguage();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Profile Form State
  const [profile, setProfile] = useState<UserProfileInput>({
    age: 24,
    gender: "FEMALE",
    casteCategory: "BC",
    annualIncome: 180000,
    isStudent: true,
    educationLevel: "Degree",
    isFarmer: false,
    landAcresWet: 0,
    landAcresDry: 0,
    isSeniorCitizen: false,
    isPersonWithDisability: false,
    stateResident: true,
  });

  const [results, setResults] = useState<AssessmentResult[] | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
        setStep(4);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setResults(null);
  };

  const eligibleMatches = results?.filter((r) => r.status === "ELIGIBLE") || [];
  const likelyMatches = results?.filter((r) => r.status === "LIKELY_ELIGIBLE") || [];
  const otherMatches = results?.filter((r) => r.status === "NOT_ELIGIBLE" || r.status === "NEEDS_MORE_INFO") || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Wizard Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>{language === "te" ? "పారదర్శక అర్హత గణన" : "Explainable Rule Assessment"}</span>
        </div>
        <h1 className="font-display font-black text-2xl sm:text-4xl text-navy-900">
          {t.assessTitle}
        </h1>
        <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
          {t.assessSubtitle}
        </p>
      </div>

      {/* Step Indicator */}
      <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-xs">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div
            className={`p-2 rounded-lg font-semibold transition ${
              step === 1 ? "bg-teal-600 text-white" : step > 1 ? "bg-teal-50 text-teal-800" : "text-navy-400 bg-navy-50"
            }`}
          >
            {t.step1Basic}
          </div>
          <div
            className={`p-2 rounded-lg font-semibold transition ${
              step === 2 ? "bg-teal-600 text-white" : step > 2 ? "bg-teal-50 text-teal-800" : "text-navy-400 bg-navy-50"
            }`}
          >
            {t.step2Socio}
          </div>
          <div
            className={`p-2 rounded-lg font-semibold transition ${
              step === 3 ? "bg-teal-600 text-white" : step > 3 ? "bg-teal-50 text-teal-800" : "text-navy-400 bg-navy-50"
            }`}
          >
            {t.step3Specific}
          </div>
          <div
            className={`p-2 rounded-lg font-semibold transition ${
              step === 4 ? "bg-teal-600 text-white" : "text-navy-400 bg-navy-50"
            }`}
          >
            {t.step4Results}
          </div>
        </div>
      </div>

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-navy-100 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="font-display font-bold text-lg text-navy-900 border-b border-navy-100 pb-3">
            {language === "te" ? "దశ 1: ప్రాథమిక వివరాలు" : "Step 1: Personal Basics"}
          </h2>

          <div className="space-y-4">
            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1.5">{t.qAge}</label>
              <input
                type="number"
                min="1"
                max="105"
                value={profile.age || ""}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                className="w-full sm:w-48 px-3.5 py-2.5 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1.5">{t.qGender}</label>
              <div className="grid grid-cols-3 gap-2 sm:w-80">
                {(["FEMALE", "MALE", "OTHER"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setProfile({ ...profile, gender: g })}
                    className={`py-2 text-xs font-semibold rounded-lg border transition ${
                      profile.gender === g
                        ? "bg-navy-900 text-white border-navy-900"
                        : "bg-white text-navy-700 border-navy-200 hover:bg-navy-50"
                    }`}
                  >
                    {g === "FEMALE" ? t.qFemale : g === "MALE" ? t.qMale : t.qOther}
                  </button>
                ))}
              </div>
            </div>

            {/* State Resident */}
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1.5">
                {t.qStateResident}
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, stateResident: true })}
                  className={`px-5 py-2 text-xs font-semibold rounded-lg border transition ${
                    profile.stateResident
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white text-navy-700 border-navy-200 hover:bg-navy-50"
                  }`}
                >
                  {language === "te" ? "అవును (ఆంధ్రప్రదేశ్)" : "Yes (Andhra Pradesh)"}
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, stateResident: false })}
                  className={`px-5 py-2 text-xs font-semibold rounded-lg border transition ${
                    !profile.stateResident
                      ? "bg-navy-900 text-white border-navy-900"
                      : "bg-white text-navy-700 border-navy-200 hover:bg-navy-50"
                  }`}
                >
                  {language === "te" ? "కాదు (ఇతర రాష్ట్రం)" : "No (Other State)"}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-navy-100 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition"
            >
              <span>{t.btnNext}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Socio-Economic Profile */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-navy-100 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="font-display font-bold text-lg text-navy-900 border-b border-navy-100 pb-3">
            {language === "te" ? "దశ 2: సామాజిక & ఆర్థిక వివరాలు" : "Step 2: Socio-Economic Profile"}
          </h2>

          <div className="space-y-4">
            {/* Caste / Social Category */}
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1.5">{t.qCaste}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: "SC", label: t.qCasteSC },
                  { id: "ST", label: t.qCasteST },
                  { id: "BC", label: t.qCasteBC },
                  { id: "Minority", label: t.qCasteMinority },
                  { id: "OC", label: t.qCasteOC },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, casteCategory: c.id as any })}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-left transition ${
                      profile.casteCategory === c.id
                        ? "bg-navy-900 text-white border-navy-900"
                        : "bg-white text-navy-700 border-navy-200 hover:bg-navy-50"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Annual Income */}
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">
                {t.qIncome}
              </label>
              <span className="text-[11px] text-navy-500 block mb-2">
                {language === "te"
                  ? "కుటుంబ సభ్యులందరి వార్షిక స్థూల ఆదాయం (రైస్ కార్డు / ఆదాయ ధృవీకరణ పత్రం ప్రకారం)"
                  : "Gross annual income as per your White Rice Card or MeeSeva Income Certificate."}
              </span>
              <div className="relative w-full sm:w-64">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 font-bold">₹</span>
                <input
                  type="number"
                  step="10000"
                  value={profile.annualIncome || ""}
                  onChange={(e) => setProfile({ ...profile, annualIncome: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-navy-100 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center space-x-1 px-4 py-2 rounded-lg border border-navy-200 text-xs font-semibold text-navy-600 hover:bg-navy-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.btnBack}</span>
            </button>

            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition"
            >
              <span>{t.btnNext}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Occupation & Land Details */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-navy-100 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="font-display font-bold text-lg text-navy-900 border-b border-navy-100 pb-3">
            {language === "te" ? "దశ 3: వృత్తి & భూమి వివరాలు" : "Step 3: Occupation & Land Details"}
          </h2>

          <div className="space-y-5">
            {/* Student Checkbox */}
            <div className="p-4 rounded-xl border border-navy-200 bg-navy-50/50 space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.isStudent}
                  onChange={(e) => setProfile({ ...profile, isStudent: e.target.checked })}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-xs font-bold text-navy-900">{t.qStudent}</span>
              </label>

              {profile.isStudent && (
                <div className="pl-7 pt-2">
                  <label className="block text-xs font-medium text-navy-600 mb-1">
                    {language === "te" ? "విద్యా స్థాయి" : "Course Level"}
                  </label>
                  <select
                    value={profile.educationLevel || "Degree"}
                    onChange={(e) => setProfile({ ...profile, educationLevel: e.target.value })}
                    className="text-xs px-3 py-2 rounded-lg border border-navy-300 bg-white"
                  >
                    <option value="School">School (Class 1-12)</option>
                    <option value="Intermediate">Intermediate (10+2)</option>
                    <option value="Polytechnic">Polytechnic / ITI</option>
                    <option value="Degree">Undergraduate Degree (BA, B.Com, B.Sc, B.Tech)</option>
                    <option value="PostGraduate">Postgraduate / Professional (MBA, MCA, M.Tech)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Farmer Checkbox */}
            <div className="p-4 rounded-xl border border-navy-200 bg-navy-50/50 space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.isFarmer}
                  onChange={(e) => setProfile({ ...profile, isFarmer: e.target.checked })}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-xs font-bold text-navy-900">{t.qFarmer}</span>
              </label>

              {profile.isFarmer && (
                <div className="pl-7 grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-navy-600 mb-1">{t.qWetLand}</label>
                    <input
                      type="number"
                      step="0.5"
                      value={profile.landAcresWet || 0}
                      onChange={(e) =>
                        setProfile({ ...profile, landAcresWet: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-navy-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-navy-600 mb-1">{t.qDryLand}</label>
                    <input
                      type="number"
                      step="0.5"
                      value={profile.landAcresDry || 0}
                      onChange={(e) =>
                        setProfile({ ...profile, landAcresDry: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-navy-300 text-xs bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Senior Citizen Check */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-navy-200 bg-white">
              <span className="text-xs font-semibold text-navy-800">{t.qSenior}</span>
              <input
                type="checkbox"
                checked={profile.isSeniorCitizen || (profile.age ? profile.age >= 60 : false)}
                onChange={(e) => setProfile({ ...profile, isSeniorCitizen: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </div>

            {/* Disability SADAREM Check */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-navy-200 bg-white">
              <span className="text-xs font-semibold text-navy-800">{t.qDisability}</span>
              <input
                type="checkbox"
                checked={profile.isPersonWithDisability}
                onChange={(e) => setProfile({ ...profile, isPersonWithDisability: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-navy-100 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center space-x-1 px-4 py-2 rounded-lg border border-navy-200 text-xs font-semibold text-navy-600 hover:bg-navy-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.btnBack}</span>
            </button>

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md transition"
            >
              {loading ? (
                <span>{language === "te" ? "లెక్కిస్తోంది..." : "Evaluating Rules..."}</span>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>{t.btnCalculate}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Assessment Results */}
      {step === 4 && results && (
        <div className="space-y-8">
          {/* Results Summary Box */}
          <div className="bg-white rounded-2xl border border-navy-100 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  {language === "te" ? "అర్హత నివేదిక" : "Eligibility Assessment Report"}
                </span>
                <h2 className="font-display font-black text-2xl text-navy-900 mt-0.5">
                  {t.resultsTitle}
                </h2>
                <p className="text-xs text-navy-500 mt-1">{t.resultsSubtitle}</p>
              </div>

              <button
                onClick={handleReset}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-navy-200 text-xs font-semibold text-navy-700 hover:bg-navy-50 self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.btnReset}</span>
              </button>
            </div>

            {/* Quick Summary Pill Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs text-emerald-800 font-semibold block">{t.statusEligible}</span>
                <span className="font-display text-2xl font-black text-emerald-700">
                  {eligibleMatches.length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
                <span className="text-xs text-teal-800 font-semibold block">{t.statusLikely}</span>
                <span className="font-display text-2xl font-black text-teal-700">
                  {likelyMatches.length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-navy-50 border border-navy-200 col-span-2 sm:col-span-1">
                <span className="text-xs text-navy-700 font-semibold block">Total Evaluated</span>
                <span className="font-display text-2xl font-black text-navy-900">
                  {results.length}
                </span>
              </div>
            </div>

            {/* Government Public Disclaimer Alert */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">
                  {language === "te" ? "ప్రాథమిక మార్గదర్శక హెచ్చరిక:" : "Non-Binding Public Advisory:"}
                </span>
                <p>
                  {language === "te"
                    ? "ఈ ఫలితాలు ప్రచురితమైన నిబంధనలతో పోల్చిన ప్రాథమిక అంచనా మాత్రమే. తుది మంజూరు సంబంధిత ప్రభుత్వ శాఖ లేదా గ్రామ/వార్డు సచివాలయం ఫీల్డ్ వెరిఫికేషన్ మరియు సోషల్ ఆడిట్ ఆధారంగా జరుగుతుంది."
                    : "This report constitutes preliminary informational guidance derived from published departmental guidelines. Formal sanction is exclusively determined by designated government authorities and Grama/Ward Sachivalayams upon physical document verification and social audit."}
                </p>
              </div>
            </div>
          </div>

          {/* Results List: High Matches */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-navy-900 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>
                {language === "te" ? "పూర్తి అర్హత కలిగిన పథకాలు" : "High Match Schemes (Criteria Satisfied)"}
              </span>
            </h3>

            {eligibleMatches.length === 0 && (
              <div className="p-6 bg-white rounded-xl border border-navy-100 text-xs text-navy-500 text-center">
                No schemes with 100% satisfied criteria based on current answers. Check potential matches below.
              </div>
            )}

            {eligibleMatches.map((res) => (
              <AssessmentResultCard key={res.schemeId} result={res} />
            ))}
          </div>

          {/* Results List: Potential / Likely Matches */}
          {likelyMatches.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-navy-900 flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-teal-600" />
                <span>
                  {language === "te"
                    ? "అర్హత ఉండే అవకాశం ఉన్న పథకాలు (మరిన్ని వివరాలు కావాలి)"
                    : "Likely Matches (Pending Verification)"}
                </span>
              </h3>

              {likelyMatches.map((res) => (
                <AssessmentResultCard key={res.schemeId} result={res} />
              ))}
            </div>
          )}

          {/* Criteria Not Met Section (Collapsible) */}
          {otherMatches.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-navy-700 flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-navy-400" />
                <span>
                  {language === "te" ? "నిబంధనలు సరిపోలని ఇతర పథకాలు" : "Schemes Where Criteria Are Not Met"}
                </span>
              </h3>

              {otherMatches.map((res) => (
                <AssessmentResultCard key={res.schemeId} result={res} isMismatched />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AssessmentResultCard({
  result,
  isMismatched = false,
}: {
  result: AssessmentResult;
  isMismatched?: boolean;
}) {
  const { language, t } = useLanguage();
  const [expanded, setExpanded] = useState(!isMismatched);

  const title = language === "te" ? result.schemeTitleTe : result.schemeTitleEn;

  return (
    <div
      className={`bg-white rounded-2xl border transition-all ${
        result.status === "ELIGIBLE"
          ? "border-emerald-200 shadow-sm"
          : result.status === "LIKELY_ELIGIBLE"
          ? "border-teal-200 shadow-sm"
          : "border-navy-100 opacity-90"
      }`}
    >
      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                result.status === "ELIGIBLE"
                  ? "bg-emerald-100 text-emerald-800"
                  : result.status === "LIKELY_ELIGIBLE"
                  ? "bg-teal-100 text-teal-800"
                  : "bg-navy-100 text-navy-700"
              }`}
            >
              {result.status === "ELIGIBLE"
                ? t.statusEligible
                : result.status === "LIKELY_ELIGIBLE"
                ? t.statusLikely
                : t.statusNotEligible}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-navy-50 text-navy-600">
              {result.category}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-navy-700">Match Score: {result.score}%</span>
            <div className="w-16 h-2 bg-navy-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  result.status === "ELIGIBLE"
                    ? "bg-emerald-500"
                    : result.status === "LIKELY_ELIGIBLE"
                    ? "bg-teal-500"
                    : "bg-navy-400"
                }`}
                style={{ width: `${result.score}%` }}
              ></div>
            </div>
          </div>
        </div>

        <h4 className="font-display font-bold text-lg text-navy-900">{title}</h4>

        {/* Explainability Breakdown Accordion */}
        <div className="pt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center space-x-1"
          >
            <span>
              {expanded
                ? language === "te"
                  ? "వివరణాత్మక కారణాలను దాచండి"
                  : "Hide Detailed Condition Breakdown"
                : language === "te"
                ? "ఎందుకు అర్హత ఉందో కారణాలు చూడండి"
                : "View Condition-by-Condition Reasons"}
            </span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
          </button>

          {expanded && (
            <div className="mt-3 space-y-3 pt-3 border-t border-navy-100 text-xs">
              {/* Satisfied conditions */}
              {result.satisfiedConditions.length > 0 && (
                <div>
                  <span className="font-bold text-emerald-800 block mb-1">
                    ✓ {t.satisfiedHeading}:
                  </span>
                  <div className="space-y-1">
                    {result.satisfiedConditions.map((c, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-emerald-950 flex items-start space-x-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold block">
                            {language === "te" ? c.labelTe : c.labelEn}
                          </span>
                          <p className="text-[11px] text-emerald-800">
                            {language === "te" ? c.detailTe : c.detailEn}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uncertain or missing conditions */}
              {result.missingOrUncertainConditions.length > 0 && (
                <div>
                  <span className="font-bold text-teal-800 block mb-1">
                    ? {t.uncertainHeading}:
                  </span>
                  <div className="space-y-1">
                    {result.missingOrUncertainConditions.map((c, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-teal-50/60 border border-teal-100 text-teal-950 flex items-start space-x-2"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold block">
                            {language === "te" ? c.labelTe : c.labelEn}
                          </span>
                          <p className="text-[11px] text-teal-800">
                            {language === "te" ? c.detailTe : c.detailEn}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Failed conditions */}
              {result.failedConditions.length > 0 && (
                <div>
                  <span className="font-bold text-red-800 block mb-1">
                    ✕ {t.failedHeading}:
                  </span>
                  <div className="space-y-1">
                    {result.failedConditions.map((c, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-red-50/60 border border-red-100 text-red-950 flex items-start space-x-2"
                      >
                        <XCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold block">
                            {language === "te" ? c.labelTe : c.labelEn}
                          </span>
                          <p className="text-[11px] text-red-800">
                            {language === "te" ? c.detailTe : c.detailEn}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3 bg-navy-50 rounded-b-2xl border-t border-navy-100 flex flex-wrap items-center justify-between gap-2">
        <a
          href={`/schemes/${result.schemeId}`}
          className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center space-x-1"
        >
          <span>{t.prepareChecklist}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>

        <a
          href={result.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-navy-800 hover:text-navy-950 flex items-center space-x-1"
        >
          <span>{t.directOfficialLink}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

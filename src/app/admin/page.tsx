"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { SchemeItem } from "@/types/scheme";
import {
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Calendar,
  ExternalLink,
  History,
  Building2,
  Save,
  X,
  FileCheck2,
  Search,
} from "lucide-react";

export default function AdminPage() {
  const { language, t } = useLanguage();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [schemes, setSchemes] = useState<SchemeItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"schemes" | "audit">("schemes");

  // Create / Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({
    titleEn: "",
    titleTe: "",
    category: "Education",
    departmentEn: "",
    departmentTe: "",
    level: "State",
    state: "Andhra Pradesh",
    descriptionEn: "",
    descriptionTe: "",
    benefitsEn: "",
    benefitsTe: "",
    eligibilitySummaryEn: "",
    eligibilitySummaryTe: "",
    officialUrl: "",
    portalName: "",
    helpline: "1902",
    deadline: "Continuous",
    minAge: 18,
    maxAge: 60,
    maxAnnualIncome: 250000,
  });

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);

        if (userData.user?.role === "ADMIN") {
          await loadAdminData();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async () => {
    const [schemeRes, logRes] = await Promise.all([
      fetch("/api/schemes"),
      fetch("/api/admin/audit-logs"),
    ]);

    if (schemeRes.ok) {
      const data = await schemeRes.json();
      setSchemes(data.schemes || []);
    }

    if (logRes.ok) {
      const logData = await logRes.json();
      setAuditLogs(logData.logs || []);
    }
  };

  const handleAdminDemoLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDemo: true, demoRole: "ADMIN" }),
    });
    if (res.ok) {
      const data = await res.json();
      setCurrentUser(data.user);
      await loadAdminData();
    }
  };

  const handleOpenCreateModal = () => {
    setEditingScheme(null);
    setFormData({
      titleEn: "",
      titleTe: "",
      category: "Education",
      departmentEn: "Social Welfare Department, Govt of AP",
      departmentTe: "సాంఘిక సంక్షేమ శాఖ, ఆంధ్రప్రదేశ్ ప్రభుత్వం",
      level: "State",
      state: "Andhra Pradesh",
      descriptionEn: "",
      descriptionTe: "",
      benefitsEn: "",
      benefitsTe: "",
      eligibilitySummaryEn: "",
      eligibilitySummaryTe: "",
      officialUrl: "https://ap.gov.in",
      portalName: "AP Official Portal",
      helpline: "1902",
      deadline: "Open All Year",
      minAge: 18,
      maxAge: 60,
      maxAnnualIncome: 250000,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (s: SchemeItem) => {
    setEditingScheme(s);
    const rule = s.rules && s.rules[0] ? s.rules[0] : null;
    setFormData({
      titleEn: s.titleEn,
      titleTe: s.titleTe,
      category: s.category,
      departmentEn: s.departmentEn,
      departmentTe: s.departmentTe,
      level: s.level,
      state: s.state,
      descriptionEn: s.descriptionEn,
      descriptionTe: s.descriptionTe,
      benefitsEn: s.benefitsEn,
      benefitsTe: s.benefitsTe,
      eligibilitySummaryEn: s.eligibilitySummaryEn,
      eligibilitySummaryTe: s.eligibilitySummaryTe,
      officialUrl: s.officialUrl,
      portalName: s.portalName,
      helpline: s.helpline || "",
      deadline: s.deadline || "",
      minAge: rule?.minAge ?? 18,
      maxAge: rule?.maxAge ?? 60,
      maxAnnualIncome: rule?.maxAnnualIncome ?? 250000,
    });
    setModalOpen(true);
  };

  const handleSaveScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingScheme) {
        // Update
        const res = await fetch(`/api/schemes/${editingScheme.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setModalOpen(false);
          await loadAdminData();
        }
      } else {
        // Create
        const rules = [
          {
            minAge: formData.minAge,
            maxAge: formData.maxAge,
            gender: "ALL",
            allowedCastes: ["ALL"],
            maxAnnualIncome: formData.maxAnnualIncome,
            studentOnly: formData.category === "Education",
            farmerOnly: formData.category === "Agriculture",
            womanOnly: formData.category === "Women Welfare",
            seniorCitizenOnly: formData.category === "Pensions & Social Security",
            stateResidentOnly: true,
          },
        ];

        const payload = {
          ...formData,
          requiredDocs: [
            {
              id: "doc_gen_1",
              nameEn: "Aadhaar Card",
              nameTe: "ఆధార్ కార్డు",
              descriptionEn: "Biometric identity verification.",
              descriptionTe: "గుర్తింపు ధృవీకరణ కార్డు.",
              whereToGetEn: "UIDAI Portal",
              whereToGetTe: "యూఐడీఏఐ పోర్టల్",
              isRequired: true,
              category: "Identity",
            },
            {
              id: "doc_gen_2",
              nameEn: "White Rice Card / Income Certificate",
              nameTe: "రైస్ కార్డు / ఆదాయ సర్టిఫికెట్",
              descriptionEn: "Proof of family annual income.",
              descriptionTe: "వార్షిక ఆదాయ ధృవీకరణ.",
              whereToGetEn: "Grama/Ward Sachivalayam",
              whereToGetTe: "గ్రామ/వార్డు సచివాలయం",
              isRequired: true,
              category: "Income",
            },
          ],
          rules,
        };

        const res = await fetch("/api/schemes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setModalOpen(false);
          await loadAdminData();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteScheme = async (id: string) => {
    if (!confirm("Are you sure you want to delete this verified scheme record?")) return;
    try {
      const res = await fetch(`/api/schemes/${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-navy-500">Checking administrative access...</p>
      </div>
    );
  }

  // Not authorized screen
  if (currentUser?.role !== "ADMIN") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="font-display font-bold text-xl text-navy-900">
          Administrator Credentials Required
        </h2>
        <p className="text-xs text-navy-600">
          This portal allows public benefit administrators to publish verified scheme circulars, maintain structured rules, and monitor audit trails.
        </p>

        <button
          onClick={handleAdminDemoLogin}
          className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow transition"
        >
          Sign In as Verified Portal Administrator
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Public Service Content Management</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-navy-900">
            {t.adminTitle}
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 mt-0.5">{t.adminSubtitle}</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.btnNewScheme}</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-navy-100 shadow-xs">
          <span className="text-xs font-medium text-navy-500">{t.totalSchemes}</span>
          <span className="font-display font-black text-2xl text-navy-900 block mt-1">
            {schemes.length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-navy-100 shadow-xs">
          <span className="text-xs font-medium text-navy-500">{t.activeSchemes}</span>
          <span className="font-display font-black text-2xl text-teal-700 block mt-1">
            {schemes.filter((s) => s.isActive).length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-navy-100 shadow-xs">
          <span className="text-xs font-medium text-navy-500">{t.verifiedRecords}</span>
          <span className="font-display font-black text-2xl text-emerald-700 block mt-1">
            {schemes.filter((s) => s.isVerified).length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-navy-100 shadow-xs">
          <span className="text-xs font-medium text-navy-500">Audit Actions</span>
          <span className="font-display font-black text-2xl text-amber-700 block mt-1">
            {auditLogs.length}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-navy-200 text-xs sm:text-sm font-semibold space-x-4">
        <button
          onClick={() => setActiveTab("schemes")}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition ${
            activeTab === "schemes"
              ? "border-teal-600 text-teal-800"
              : "border-transparent text-navy-500 hover:text-navy-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Scheme Directory ({schemes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition ${
            activeTab === "audit"
              ? "border-teal-600 text-teal-800"
              : "border-transparent text-navy-500 hover:text-navy-900"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab: Scheme Management Table */}
      {activeTab === "schemes" && (
        <div className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-50 text-navy-700 uppercase tracking-wider font-semibold border-b border-navy-100">
                <tr>
                  <th className="py-3.5 px-4">{t.colTitle}</th>
                  <th className="py-3.5 px-4">{t.colCategory}</th>
                  <th className="py-3.5 px-4">{t.colLevel}</th>
                  <th className="py-3.5 px-4">{t.colVerifiedDate}</th>
                  <th className="py-3.5 px-4">{t.colStatus}</th>
                  <th className="py-3.5 px-4 text-right">{t.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {schemes.map((s) => (
                  <tr key={s.id} className="hover:bg-navy-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-navy-900">{s.titleEn}</div>
                      <div className="text-[11px] text-navy-500 font-telugu">{s.titleTe}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-medium">
                        {s.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-navy-600">{s.level} ({s.state})</td>
                    <td className="py-3.5 px-4 text-navy-500">
                      {new Date(s.verifiedDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(s)}
                        className="text-navy-600 hover:text-teal-700 font-medium px-2 py-1 rounded hover:bg-navy-100 transition"
                      >
                        {t.btnEdit}
                      </button>
                      <button
                        onClick={() => handleDeleteScheme(s.id)}
                        className="text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50 transition"
                      >
                        {t.btnDelete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Audit Trail */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-navy-900 flex items-center space-x-2">
            <History className="w-4 h-4 text-teal-600" />
            <span>Content Modification & Audit Log</span>
          </h3>

          <div className="space-y-3">
            {auditLogs.map((log) => {
              let details: any = {};
              try {
                details = JSON.parse(log.detailsJson);
              } catch (e) {}

              return (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-navy-100 bg-navy-50/50 flex items-start justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-navy-900 uppercase tracking-wider bg-navy-200/60 px-2 py-0.5 rounded text-[10px]">
                        {log.action}
                      </span>
                      <span className="text-navy-500">•</span>
                      <span className="font-semibold text-teal-800">{log.entityType}</span>
                    </div>
                    <p className="text-navy-700">
                      {details.change || details.titleEn || JSON.stringify(details)}
                    </p>
                    <p className="text-[11px] text-navy-400">
                      Admin: {log.admin?.name || log.admin?.email || "System"}
                    </p>
                  </div>

                  <span className="text-[11px] text-navy-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create / Edit Scheme Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-navy-100">
              <h3 className="font-display font-bold text-lg text-navy-900">
                {editingScheme ? "Edit Verified Scheme Record" : "Publish New Government Scheme"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-navy-400 hover:text-navy-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScheme} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-navy-700 mb-1">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-navy-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-navy-700 mb-1">Title (Telugu)</label>
                  <input
                    type="text"
                    value={formData.titleTe}
                    onChange={(e) => setFormData({ ...formData, titleTe: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-navy-200 text-xs font-telugu"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-navy-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-navy-200 text-xs bg-white"
                  >
                    <option value="Education">Education</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Women Welfare">Women Welfare</option>
                    <option value="Pensions & Social Security">Pensions & Social Security</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Housing">Housing</option>
                    <option value="Employment & Skills">Employment & Skills</option>
                    <option value="Welfare">Welfare</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-navy-700 mb-1">Level *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-navy-200 text-xs bg-white"
                  >
                    <option value="State">State</option>
                    <option value="Central">Central</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-navy-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-navy-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-navy-700 mb-1">Department (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.departmentEn}
                  onChange={(e) => setFormData({ ...formData, departmentEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-navy-700 mb-1">Scheme Overview (English) *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-navy-700 mb-1">Benefits Breakdown *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.benefitsEn}
                  onChange={(e) => setFormData({ ...formData, benefitsEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-navy-700 mb-1">Published Eligibility Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.eligibilitySummaryEn}
                  onChange={(e) => setFormData({ ...formData, eligibilitySummaryEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-navy-700 mb-1">Official Portal URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.officialUrl}
                    onChange={(e) => setFormData({ ...formData, officialUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-navy-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-navy-700 mb-1">Official Portal Name</label>
                  <input
                    type="text"
                    value={formData.portalName}
                    onChange={(e) => setFormData({ ...formData, portalName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-navy-200 text-xs"
                  />
                </div>
              </div>

              {/* Structured Rules Quick Setters */}
              <div className="p-3 bg-navy-50 rounded-xl border border-navy-100 space-y-2">
                <span className="font-bold text-navy-900 block">Structured Eligibility Thresholds</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-navy-600">Min Age</label>
                    <input
                      type="number"
                      value={formData.minAge}
                      onChange={(e) => setFormData({ ...formData, minAge: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 rounded border border-navy-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-navy-600">Max Age</label>
                    <input
                      type="number"
                      value={formData.maxAge}
                      onChange={(e) => setFormData({ ...formData, maxAge: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 rounded border border-navy-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-navy-600">Max Income (₹)</label>
                    <input
                      type="number"
                      step="10000"
                      value={formData.maxAnnualIncome}
                      onChange={(e) =>
                        setFormData({ ...formData, maxAnnualIncome: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-2 py-1.5 rounded border border-navy-200 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-navy-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow flex items-center space-x-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Scheme Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


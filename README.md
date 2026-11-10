# JanSetu (జనసేతు) — AI-Powered Government Scheme Discovery & Access Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)](https://www.prisma.io/)
[![State Focus](https://img.shields.io/badge/Focus-Andhra%20Pradesh%20%26%20Bharat-teal)](#)

> **JanSetu** is an accessible, bilingual, and explainable AI-powered digital public benefit discovery platform designed to help citizens across Andhra Pradesh and India discover government welfare schemes, understand published eligibility criteria, prepare required document checklists, and navigate official government application channels.

---

## 🏛️ Key Features & Capabilities

### 1. 🔍 Government Scheme Discovery Catalog
- **Multilingual Search & Filtering**: Search in English or Telugu across categories including **Education & Scholarships**, **Agriculture & Subsidies**, **Women Welfare**, **Pensions & Social Security**, **Healthcare**, **Housing**, and **Artisans**.
- **Verified Official Sources**: Every scheme record displays the responsible nodal department, official portal URL, official helpline, and last verified date.
- **Geographic & Category Scoping**: Real-time filtering by administrative jurisdiction (State AP vs Central GOI) and target beneficiary group.

### 2. 🧮 Guided Deterministic Eligibility Assessment Wizard
- **4-Step Questionnaire**: Collects basic information (age, gender, social category/caste, annual income, student status, landholding in acres, residency).
- **Explainable Rule Engine**: Computes transparency reports breaking down **Satisfied Conditions**, **Failed Conditions**, and **Uncertain/Missing Information**.
- **Ethical Public Notice**: Clearly labels all results as *preliminary informational guidance*, reiterating that official sanctions occur exclusively through departmental verification at Grama/Ward Sachivalayams.

### 3. 📋 Interactive Document Preparation Checklist Tracker
- **Step-by-Step Readiness Tracker**: Helps citizens mark documents as *Ready* or *Pending* before visiting application centers.
- **Issuing Authority Directory**: Highlights exactly where to obtain each certificate (e.g., Grama/Ward Sachivalayam, MeeSeva, Meebhoomi portal, Tahsildar office, Bank branch).
- **Printable Checklist**: One-click printable layout for citizen reference.

### 4. 🤖 Grounded JanSetu AI Assistant (Bilingual RAG)
- **Natural Language in English & Telugu**: Seamlessly answers citizen inquiries with strict retrieval grounding.
- **Zero Hallucination Policy**: Grounded exclusively in verified scheme records in the database with explicit source links and verification dates.
- **Fallback Resilience**: Operates either connected to the **Google Gemini API** (`GEMINI_API_KEY`) or via its built-in intelligent contextual synthesis engine for 100% offline uptime.

### 5. 👤 Citizen Welfare Dashboard
- **Secure Authentication**: Pre-configured with 1-click Demo Citizen (**Ramesh Babu Vangaveeti**) and customizable credentials.
- **Saved Schemes & Bookmarks**: Save schemes for future follow-up.
- **Checklist Progress Tracker**: Live tally of prepared vs pending certificates.
- **Privacy Controls**: Zero collection of sensitive Aadhaar OTPs or banking credentials.

### 6. 🛡️ Public Benefit Administration Portal
- **Scheme Record Management**: Create, view, edit, and deactivate scheme circulars.
- **Structured Threshold Configurator**: Adjust min/max age, income limits, and land limits in real time.
- **Audit Trail**: Every creation and modification is logged with timestamps and administrator attribution.

---

## 🏗️ Architecture & Technology Stack

```
                        ┌────────────────────────────────────────────────────────┐
                        │              JanSetu Web Client (Next.js)              │
                        │       React 18 + Tailwind CSS + Lucide + i18n          │
                        └───────────────┬────────────────────────┬───────────────┘
                                        │                        │
                     HTTP / JSON        │                        │ Dynamic RAG
                                        ▼                        ▼
                        ┌────────────────────────┐      ┌────────────────────────┐
                        │   Next.js API Layer    │      │ JanSetu AI Assistant   │
                        │   - /api/schemes       │      │ - Semantic Retrieval   │
                        │   - /api/assess        │      │ - Gemini API / Built-in│
                        │   - /api/auth          │      │ - Source Citations     │
                        └───────────────┬────────┘      └────────┬───────────────┘
                                        │                        │
                                        ▼                        ▼
                        ┌────────────────────────────────────────────────────────┐
                        │               Prisma ORM & SQLite / Postgres           │
                        │  Schemes • EligibilityRules • Users • Checklists • Logs│
                        └────────────────────────────────────────────────────────┘
```

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Design Tokens**: Deep Navy (`#0F2537`), Trustworthy Teal (`#0D9488`), Warm Ivory (`#FAF9F5`), Muted Saffron (`#D97706`)
- **Typography**: Inter (Body), Manrope (Display), Noto Sans Telugu (Telugu)
- **Database & ORM**: SQLite (`prisma/dev.db`) for instant local setup; seamlessly switches to managed PostgreSQL for Vercel/cloud deployment via `DATABASE_URL`
- **Security**: HttpOnly session cookies, bcrypt password hashing, input sanitization

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18.17+ or v20+)
- npm (v9+)

### 2. Installation
```bash
git clone https://github.com/your-username/jansetu.git
cd jansetu
npm install
```

### 3. Database Initialization & Seeding
```bash
# Push Prisma schema to SQLite
npx prisma db push

# Seed initial verified Andhra Pradesh schemes, rules, and demo accounts
node scripts/seed.mjs
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Citizen (రమేష్ బాబు)** | `citizen@jansetu.gov.in` | `Citizen@12345` | Saved schemes, checklist progress, eligibility records |
| **Administrator** | `admin@jansetu.gov.in` | `Admin@12345` | Scheme circular publisher, rule thresholds, audit trail |

*Note: You can also use the 1-click demo buttons on the [Login Page](/login) or in the Navbar.*

---

## 📊 Initial Andhra Pradesh Scheme Corpus

JanSetu includes complete, verified records for flagship Andhra Pradesh and Central welfare schemes:

1. **Jagananna Vidya Deevena (RTF)** — Full tuition fee reimbursement for higher education.
2. **Jagananna Vasathi Deevena (MTF)** — Food & hostel maintenance assistance for college students.
3. **YSR Rythu Bharosa - PM KISAN** — Annual ₹13,500 farmer & tenant financial assistance.
4. **YSR Sunna Vaddi Panta Runalu** — 100% interest subsidy on crop loans up to ₹1,00,000.
5. **YSR Cheyutha** — ₹75,000 multi-year livelihood assistance for SC/ST/BC/Minority women aged 45–60.
6. **YSR Pension Kanuka (NTR Bharosa)** — Monthly doorstep social security pension (OAP, Widow, PwD).
7. **Dr. YSR Aarogyasri** — Completely free cashless hospital treatment up to ₹25,00,000.
8. **Jagananna Amma Vodi** — ₹15,000 annual schooling assistance for mothers of school children.
9. **PM Vishwakarma Scheme** — Central skill training, ₹15,000 toolkits, and 5% credit for traditional artisans.
10. **YSR Vahana Mitra** — ₹10,000 annual recurring expense support for auto & taxi driver-owners.
11. **Jagananna Chedodu** — ₹10,000 grant for traditional barbers, washermen, and tailors.
12. **PMAY - YSR Pedalandariki Illu** — Free house site pattas and ₹1.80 Lakh housing aid for women.

---

## 🧪 Testing

Run the automated integrity test suite covering deterministic evaluation rules, RAG retrieval accuracy, and Telugu language detection:

```bash
node scripts/testEngine.mjs
```

Test Results:
- `Test 1`: Language Detection (English vs Telugu Unicode block) — **PASSED**
- `Test 2`: Student Eligibility Rule evaluation & income boundary check — **PASSED**
- `Test 3`: Farmer status & wetland threshold verification — **PASSED**
- `Test 4`: Women age bracket (45–60) enforcement — **PASSED**
- `Test 5`: RAG semantic keyword retrieval across Andhra Pradesh corpus — **PASSED**
- `Test 6`: Grounded AI response generation with portal citations — **PASSED**

---

## 🌐 Environment Variables

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | SQLite or PostgreSQL connection string | `file:./dev.db` |
| `GEMINI_API_KEY` | Optional Google Gemini API key for generative RAG | `""` (falls back to built-in synthesis) |
| `NEXTAUTH_SECRET` | Secret key for session encryption | Random 32+ character string |
| `NEXT_PUBLIC_APP_URL` | Base public URL | `http://localhost:3000` |

---

## 📜 Public Notice & Transparency Disclaimer

JanSetu is an informational guidance platform grounded in verified public data. JanSetu does not issue government sanctions, process fund transfers, or guarantee benefit approvals. All applications must be submitted directly through official government portals (such as Jnanabhumi, Navasakam, Rythu Bharosa) or physically at Grama/Ward Sachivalayams.

export type Language = "en" | "te";

export type BeneficiaryCategory = 
  | "Students"
  | "Farmers"
  | "Women"
  | "Senior Citizens"
  | "Job Seekers"
  | "Artisans & Craftsmen"
  | "Fishermen"
  | "Transport Workers"
  | "General Citizens";

export type SchemeCategory =
  | "Education"
  | "Agriculture"
  | "Women Welfare"
  | "Pensions & Social Security"
  | "Employment & Skills"
  | "Healthcare"
  | "Housing"
  | "Welfare";

export interface DocumentItem {
  id: string;
  nameEn: string;
  nameTe: string;
  descriptionEn: string;
  descriptionTe: string;
  whereToGetEn: string;
  whereToGetTe: string;
  isRequired: boolean;
  category: "Identity" | "Income" | "Caste" | "Residence" | "Academic" | "Land" | "Banking" | "Medical";
}

export interface EligibilityConditionRule {
  minAge?: number | null;
  maxAge?: number | null;
  gender: "ALL" | "FEMALE" | "MALE";
  allowedCastes: string[]; // ["SC", "ST", "BC", "OC", "Minority", "ALL"]
  maxAnnualIncome?: number | null; // e.g. 250000
  studentOnly: boolean;
  minEducationLevel?: string | null; // "School" | "Intermediate" | "Degree" | "PostGraduate" | "Professional"
  farmerOnly: boolean;
  maxLandAcresWet?: number | null;
  maxLandAcresDry?: number | null;
  womanOnly: boolean;
  seniorCitizenOnly: boolean;
  disabilityMinPercent?: number | null;
  stateResidentOnly: boolean;
  specificConditions?: string[];
}

export interface SchemeItem {
  id: string;
  slug: string;
  titleEn: string;
  titleTe: string;
  category: SchemeCategory;
  departmentEn: string;
  departmentTe: string;
  level: "State" | "Central";
  state: string;
  descriptionEn: string;
  descriptionTe: string;
  benefitsEn: string;
  benefitsTe: string;
  eligibilitySummaryEn: string;
  eligibilitySummaryTe: string;
  requiredDocs: DocumentItem[];
  applicationProcessEn: string;
  applicationProcessTe: string;
  officialUrl: string;
  portalName: string;
  helpline?: string | null;
  deadline?: string | null;
  verifiedDate: string;
  isVerified: boolean;
  isActive: boolean;
  targetBeneficiaries: string[];
  rules?: EligibilityConditionRule[];
}

export interface UserProfileInput {
  age?: number;
  gender?: "MALE" | "FEMALE" | "OTHER";
  casteCategory?: "SC" | "ST" | "BC" | "OC" | "Minority";
  annualIncome?: number;
  isStudent?: boolean;
  educationLevel?: string;
  isFarmer?: boolean;
  landAcresWet?: number;
  landAcresDry?: number;
  isWomanHeadOfFamily?: boolean;
  isSeniorCitizen?: boolean;
  isPersonWithDisability?: boolean;
  disabilityPercent?: number;
  occupation?: string;
  stateResident?: boolean;
  district?: string;
}

export type MatchStatus = "ELIGIBLE" | "LIKELY_ELIGIBLE" | "NOT_ELIGIBLE" | "NEEDS_MORE_INFO";

export interface ConditionEvaluation {
  parameter: string;
  status: "MET" | "UNMET" | "UNCERTAIN" | "OPTIONAL";
  labelEn: string;
  labelTe: string;
  detailEn: string;
  detailTe: string;
}

export interface AssessmentResult {
  schemeId: string;
  schemeTitleEn: string;
  schemeTitleTe: string;
  category: string;
  officialUrl: string;
  status: MatchStatus;
  score: number; // 0 to 100 percentage match
  satisfiedConditions: ConditionEvaluation[];
  failedConditions: ConditionEvaluation[];
  missingOrUncertainConditions: ConditionEvaluation[];
  disclaimerEn: string;
  disclaimerTe: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  language: Language;
  sources?: {
    schemeId: string;
    title: string;
    officialUrl: string;
    department: string;
    verifiedDate: string;
  }[];
  followUps?: string[];
  timestamp: string;
}

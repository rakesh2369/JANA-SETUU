import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemesJsonPath = path.join(__dirname, "../src/data/initialSchemes.json");
const initialSchemes = JSON.parse(fs.readFileSync(schemesJsonPath, "utf-8"));

console.log("=== RUNNING JANSETU INTEGRITY & LOGIC TESTS ===");

// 1. Language Detection Logic
function detectLanguage(text) {
  const teluguRegex = /[\u0C00-\u0C7F]/;
  return teluguRegex.test(text) ? "te" : "en";
}

console.log("\n[Test 1] Language Detection:");
assert.strictEqual(detectLanguage("How do I apply for Rythu Bharosa?"), "en");
assert.strictEqual(detectLanguage("రైతు భరోసా పథకం ఎలా దరఖాస్తు చేయాలి?"), "te");
console.log("✓ Language detection working for English and Telugu.");

// 2. Deterministic Eligibility Engine Tests
function evaluateSchemeEligibility(scheme, profile) {
  const satisfied = [];
  const failed = [];
  const uncertain = [];

  const rule = scheme.rules && scheme.rules.length > 0 ? scheme.rules[0] : {};

  // Age
  if (rule.minAge !== null && rule.minAge !== undefined || rule.maxAge !== null && rule.maxAge !== undefined) {
    if (profile.age !== undefined && profile.age !== null) {
      const minOk = rule.minAge ? profile.age >= rule.minAge : true;
      const maxOk = rule.maxAge ? profile.age <= rule.maxAge : true;
      if (minOk && maxOk) {
        satisfied.push({ parameter: "Age", status: "MET" });
      } else {
        failed.push({ parameter: "Age", status: "UNMET" });
      }
    } else {
      uncertain.push({ parameter: "Age", status: "UNCERTAIN" });
    }
  }

  // Gender
  if (rule.gender && rule.gender !== "ALL") {
    if (profile.gender) {
      if (profile.gender === rule.gender) {
        satisfied.push({ parameter: "Gender", status: "MET" });
      } else {
        failed.push({ parameter: "Gender", status: "UNMET" });
      }
    } else {
      uncertain.push({ parameter: "Gender", status: "UNCERTAIN" });
    }
  }

  // Income
  if (rule.maxAnnualIncome !== null && rule.maxAnnualIncome !== undefined) {
    if (profile.annualIncome !== undefined && profile.annualIncome !== null) {
      if (profile.annualIncome <= rule.maxAnnualIncome) {
        satisfied.push({ parameter: "AnnualIncome", status: "MET" });
      } else {
        failed.push({ parameter: "AnnualIncome", status: "UNMET" });
      }
    } else {
      uncertain.push({ parameter: "AnnualIncome", status: "UNCERTAIN" });
    }
  }

  // Student
  if (rule.studentOnly) {
    if (profile.isStudent !== undefined) {
      if (profile.isStudent) {
        satisfied.push({ parameter: "StudentStatus", status: "MET" });
      } else {
        failed.push({ parameter: "StudentStatus", status: "UNMET" });
      }
    } else {
      uncertain.push({ parameter: "StudentStatus", status: "UNCERTAIN" });
    }
  }

  // Farmer
  if (rule.farmerOnly) {
    if (profile.isFarmer !== undefined) {
      if (profile.isFarmer) {
        satisfied.push({ parameter: "FarmerStatus", status: "MET" });
        if (rule.maxLandAcresWet && profile.landAcresWet !== undefined) {
          if (profile.landAcresWet <= rule.maxLandAcresWet) {
            satisfied.push({ parameter: "WetLandAcres", status: "MET" });
          } else {
            failed.push({ parameter: "WetLandAcres", status: "UNMET" });
          }
        }
      } else {
        failed.push({ parameter: "FarmerStatus", status: "UNMET" });
      }
    } else {
      uncertain.push({ parameter: "FarmerStatus", status: "UNCERTAIN" });
    }
  }

  let status = "ELIGIBLE";
  if (failed.length > 0) status = "NOT_ELIGIBLE";
  else if (uncertain.length > 0) status = "LIKELY_ELIGIBLE";

  const total = satisfied.length + failed.length + uncertain.length;
  const score = total > 0 ? (failed.length > 0 ? 25 : uncertain.length > 0 ? 75 : 100) : 100;

  return {
    schemeId: scheme.id,
    status,
    score,
    satisfiedConditions: satisfied,
    failedConditions: failed,
    missingOrUncertainConditions: uncertain,
  };
}

console.log("\n[Test 2] Student Eligibility Rule (Vidya Deevena):");
const vidyaDeevena = initialSchemes.find((s) => s.id === "sch_vidya_deevena");
assert(vidyaDeevena, "Vidya Deevena scheme must exist in dataset");

// Eligible student: Age 20, female, BC, income 1.5L, student
const studentProfileEligible = {
  age: 20,
  gender: "FEMALE",
  casteCategory: "BC",
  annualIncome: 150000,
  isStudent: true,
  stateResident: true,
};
const resultEligible = evaluateSchemeEligibility(vidyaDeevena, studentProfileEligible);
assert.strictEqual(resultEligible.status, "ELIGIBLE");
assert.strictEqual(resultEligible.score, 100);
assert(resultEligible.satisfiedConditions.length >= 3);
assert.strictEqual(resultEligible.failedConditions.length, 0);
console.log("✓ Eligible student correctly scored 100% (ELIGIBLE).");

// Ineligible due to income: Income 3.5L (limit is 2.5L)
const studentProfileOverIncome = {
  ...studentProfileEligible,
  annualIncome: 350000,
};
const resultOverIncome = evaluateSchemeEligibility(vidyaDeevena, studentProfileOverIncome);
assert.strictEqual(resultOverIncome.status, "NOT_ELIGIBLE");
assert(resultOverIncome.failedConditions.some((c) => c.parameter === "AnnualIncome"));
console.log("✓ Over-income student correctly identified as NOT_ELIGIBLE with parameter: AnnualIncome.");

// TEST 3: Deterministic Rule Engine - Farmer (Rythu Bharosa)
console.log("\n[Test 3] Farmer Eligibility Rule (Rythu Bharosa):");
const rythuBharosa = initialSchemes.find((s) => s.id === "sch_rythu_bharosa");
assert(rythuBharosa, "Rythu Bharosa scheme must exist");

const farmerProfile = {
  age: 42,
  gender: "MALE",
  casteCategory: "BC",
  isFarmer: true,
  landAcresWet: 4,
  stateResident: true,
};
const farmerResult = evaluateSchemeEligibility(rythuBharosa, farmerProfile);
assert.strictEqual(farmerResult.status, "ELIGIBLE");
console.log("✓ Cultivating farmer with 4 acres wetland evaluated as ELIGIBLE.");

const nonFarmerProfile = {
  ...farmerProfile,
  isFarmer: false,
};
const nonFarmerResult = evaluateSchemeEligibility(rythuBharosa, nonFarmerProfile);
assert.strictEqual(nonFarmerResult.status, "NOT_ELIGIBLE");
assert(nonFarmerResult.failedConditions.some((c) => c.parameter === "FarmerStatus"));
console.log("✓ Non-farmer correctly flagged NOT_ELIGIBLE with reason: FarmerStatus.");

// TEST 4: Women Welfare Rule (YSR Cheyutha: Women aged 45-60)
console.log("\n[Test 4] Women Livelihood Scheme (YSR Cheyutha):");
const cheyutha = initialSchemes.find((s) => s.id === "sch_cheyutha");
assert(cheyutha, "Cheyutha scheme must exist");

// Age 50 woman SC
const cheyuthaEligible = {
  age: 50,
  gender: "FEMALE",
  casteCategory: "SC",
  annualIncome: 100000,
  stateResident: true,
};
const cheyuthaRes1 = evaluateSchemeEligibility(cheyutha, cheyuthaEligible);
assert.strictEqual(cheyuthaRes1.status, "ELIGIBLE");

// Age 25 woman (too young for Cheyutha, requires 45-60)
const cheyuthaYoung = {
  ...cheyuthaEligible,
  age: 25,
};
const cheyuthaRes2 = evaluateSchemeEligibility(cheyutha, cheyuthaYoung);
assert.strictEqual(cheyuthaRes2.status, "NOT_ELIGIBLE");
assert(cheyuthaRes2.failedConditions.some((c) => c.parameter === "Age"));
console.log("✓ Age boundary strictly enforced (45-60) for Cheyutha.");

// TEST 5: RAG Semantic & Keyword Retrieval
console.log("\n[Test 5] RAG Scheme Retrieval & Grounding:");
function retrieveRelevantSchemes(query, schemes) {
  const queryLower = query.toLowerCase();
  return schemes
    .map((s) => {
      let score = 0;
      const text = `${s.titleEn} ${s.titleTe} ${s.descriptionEn} ${s.benefitsEn} ${s.category}`.toLowerCase();
      if (text.includes(queryLower)) score += 10;
      if (queryLower.includes("farmer") || queryLower.includes("రైతు")) {
        if (s.category === "Agriculture") score += 8;
      }
      if (queryLower.includes("health") || queryLower.includes("hospital") || queryLower.includes("cashless")) {
        if (s.category === "Healthcare") score += 8;
      }
      return { scheme: s, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
}

const retrievedForFarmer = retrieveRelevantSchemes("రైతు", initialSchemes);
assert(retrievedForFarmer.length > 0);
assert(retrievedForFarmer.some((m) => m.scheme.id === "sch_rythu_bharosa"));
console.log(`✓ Retrieved ${retrievedForFarmer.length} relevant schemes for Telugu farmer query.`);

const retrievedForHealth = retrieveRelevantSchemes("cashless hospital surgery", initialSchemes);
assert(retrievedForHealth.length > 0);
assert.strictEqual(retrievedForHealth[0].scheme.id, "sch_aarogyasri");
console.log("✓ Cashless hospital query accurately retrieved Dr. YSR Aarogyasri as top result.");

console.log("\n=== ALL TEST SUITES PASSED FLAWLESSLY! ===");

import {
  AssessmentResult,
  ConditionEvaluation,
  EligibilityConditionRule,
  MatchStatus,
  SchemeItem,
  UserProfileInput,
} from "@/types/scheme";

export function evaluateSchemeEligibility(
  scheme: SchemeItem,
  profile: UserProfileInput
): AssessmentResult {
  const satisfied: ConditionEvaluation[] = [];
  const failed: ConditionEvaluation[] = [];
  const uncertain: ConditionEvaluation[] = [];

  const rules: EligibilityConditionRule[] = scheme.rules && scheme.rules.length > 0
    ? scheme.rules
    : [
        {
          gender: "ALL",
          allowedCastes: ["ALL"],
          studentOnly: false,
          farmerOnly: false,
          womanOnly: false,
          seniorCitizenOnly: false,
          stateResidentOnly: true,
        },
      ];

  // We evaluate against the scheme's rule (primary rule)
  const rule = rules[0];

  // 1. Age Evaluation
  if (rule.minAge !== null && rule.minAge !== undefined || rule.maxAge !== null && rule.maxAge !== undefined) {
    if (profile.age !== undefined && profile.age !== null) {
      const minOk = rule.minAge ? profile.age >= rule.minAge : true;
      const maxOk = rule.maxAge ? profile.age <= rule.maxAge : true;
      const ageLabel = `Age Criteria (${rule.minAge ?? 0} to ${rule.maxAge ?? "Unlimited"} years)`;

      if (minOk && maxOk) {
        satisfied.push({
          parameter: "Age",
          status: "MET",
          labelEn: ageLabel,
          labelTe: `వయోపరిమితి (${rule.minAge ?? 0} నుండి ${rule.maxAge ?? "గరిష్ట పరిమితి లేదు"} సంవత్సరాలు)`,
          detailEn: `Your age (${profile.age} years) is within the eligible range.`,
          detailTe: `మీ వయస్సు (${profile.age} సంవత్సరాలు) అర్హత పరిమితిలో ఉంది.`,
        });
      } else {
        failed.push({
          parameter: "Age",
          status: "UNMET",
          labelEn: ageLabel,
          labelTe: `వయోపరిమితి అర్హత`,
          detailEn: `Your age (${profile.age} years) does not fall within the required bracket (${rule.minAge ?? 0} - ${rule.maxAge ?? "Any"}).`,
          detailTe: `మీ వయస్సు (${profile.age} సంవత్సరాలు) నిర్దేశిత వయోపరిమితి (${rule.minAge ?? 0} - ${rule.maxAge ?? "గరిష్టం లేదు"}) లో లేదు.`,
        });
      }
    } else {
      uncertain.push({
        parameter: "Age",
        status: "UNCERTAIN",
        labelEn: "Age Verification",
        labelTe: "వయస్సు ధృవీకరణ",
        detailEn: `Age was not provided. Scheme requires age between ${rule.minAge ?? 0} and ${rule.maxAge ?? "any"}.`,
        detailTe: `వయస్సు నమోదు చేయలేదు. పథకానికి ${rule.minAge ?? 0} నుండి ${rule.maxAge ?? "గరిష్టం లేదు"} సంవత్సరాల వయస్సు అవసరం.`,
      });
    }
  }

  // 2. Gender Evaluation
  if (rule.gender && rule.gender !== "ALL") {
    if (profile.gender) {
      if (profile.gender === rule.gender) {
        satisfied.push({
          parameter: "Gender",
          status: "MET",
          labelEn: `Gender Requirement (${rule.gender})`,
          labelTe: `లింగ అర్హత (${rule.gender === "FEMALE" ? "మహిళలు" : "పురుషులు"})`,
          detailEn: `Gender criteria satisfied.`,
          detailTe: `లింగ సంబంధిత నిబంధన సరిపోయింది.`,
        });
      } else {
        failed.push({
          parameter: "Gender",
          status: "UNMET",
          labelEn: `Gender Requirement (${rule.gender})`,
          labelTe: `లింగ అర్హత`,
          detailEn: `This scheme is exclusively applicable to ${rule.gender.toLowerCase()} applicants.`,
          detailTe: `ఈ పథకం కేవలం ${rule.gender === "FEMALE" ? "మహిళలకు" : "పురుషులకు"} మాత్రమే వర్తిస్తుంది.`,
        });
      }
    } else {
      uncertain.push({
        parameter: "Gender",
        status: "UNCERTAIN",
        labelEn: "Gender Requirement",
        labelTe: "లింగ అర్హత సమాచారం",
        detailEn: `Gender was not provided. Scheme is specifically for ${rule.gender.toLowerCase()} applicants.`,
        detailTe: `లింగం పేర్కొనబడలేదు. ఈ పథకం ${rule.gender === "FEMALE" ? "మహిళలకు" : "పురుషులకు"} నిర్దేశించబడింది.`,
      });
    }
  }

  // 3. Social Category / Caste
  if (rule.allowedCastes && !rule.allowedCastes.includes("ALL")) {
    if (profile.casteCategory) {
      if (rule.allowedCastes.includes(profile.casteCategory)) {
        satisfied.push({
          parameter: "SocialCategory",
          status: "MET",
          labelEn: `Social Category (${rule.allowedCastes.join(", ")})`,
          labelTe: `సామాజిక వర్గ అర్హత (${rule.allowedCastes.join(", ")})`,
          detailEn: `Your category (${profile.casteCategory}) is eligible for this benefit.`,
          detailTe: `మీ సామాజిక వర్గం (${profile.casteCategory}) ఈ పథకానికి అర్హత పొందింది.`,
        });
      } else {
        failed.push({
          parameter: "SocialCategory",
          status: "UNMET",
          labelEn: `Social Category (${rule.allowedCastes.join(", ")})`,
          labelTe: `సామాజిక వర్గ నిబంధన`,
          detailEn: `Applicable to ${rule.allowedCastes.join(", ")} communities only. Selected category: ${profile.casteCategory}.`,
          detailTe: `ఈ పథకం కేవలం ${rule.allowedCastes.join(", ")} వర్గాలకు మాత్రమే వర్తిస్తుంది.`,
        });
      }
    } else {
      uncertain.push({
        parameter: "SocialCategory",
        status: "UNCERTAIN",
        labelEn: "Social Category Eligibility",
        labelTe: "సామాజిక వర్గ వివరాలు",
        detailEn: `Social category not provided. Applicable to ${rule.allowedCastes.join(", ")}.`,
        detailTe: `సామాజిక వర్గం నమోదు చేయలేదు. ఇది ${rule.allowedCastes.join(", ")} వర్గాల వారికి వర్తిస్తుంది.`,
      });
    }
  }

  // 4. Annual Income
  if (rule.maxAnnualIncome !== null && rule.maxAnnualIncome !== undefined) {
    if (profile.annualIncome !== undefined && profile.annualIncome !== null) {
      if (profile.annualIncome <= rule.maxAnnualIncome) {
        satisfied.push({
          parameter: "AnnualIncome",
          status: "MET",
          labelEn: `Income Ceiling (₹${(rule.maxAnnualIncome / 100000).toFixed(2)} Lakh/year)`,
          labelTe: `వార్షిక ఆదాయ పరిమితి (₹${(rule.maxAnnualIncome / 100000).toFixed(2)} లక్షలు/సం.)`,
          detailEn: `Your declared income of ₹${profile.annualIncome.toLocaleString("en-IN")} is within the ceiling of ₹${rule.maxAnnualIncome.toLocaleString("en-IN")}.`,
          detailTe: `మీ వార్షిక ఆదాయం ₹${profile.annualIncome.toLocaleString("en-IN")} పరిమితి ₹${rule.maxAnnualIncome.toLocaleString("en-IN")} లోపు ఉంది.`,
        });
      } else {
        failed.push({
          parameter: "AnnualIncome",
          status: "UNMET",
          labelEn: `Income Ceiling (₹${(rule.maxAnnualIncome / 100000).toFixed(2)} Lakh/year)`,
          labelTe: `ఆదాయ పరిమితి అధిగమించబడింది`,
          detailEn: `Your declared income of ₹${profile.annualIncome.toLocaleString("en-IN")} exceeds the scheme's limit of ₹${rule.maxAnnualIncome.toLocaleString("en-IN")}.`,
          detailTe: `మీ ఆదాయం ₹${profile.annualIncome.toLocaleString("en-IN")} పథక పరిమితి ₹${rule.maxAnnualIncome.toLocaleString("en-IN")} కంటే ఎక్కువగా ఉంది.`,
        });
      }
    } else {
      uncertain.push({
        parameter: "AnnualIncome",
        status: "UNCERTAIN",
        labelEn: "Income Verification",
        labelTe: "ఆదాయ నిర్ధారణ",
        detailEn: `Annual family income not specified. Scheme requires income <= ₹${rule.maxAnnualIncome.toLocaleString("en-IN")}.`,
        detailTe: `వార్షిక ఆదాయం పేర్కొనలేదు. ఈ పథకానికి వార్షిక ఆదాయం ₹${rule.maxAnnualIncome.toLocaleString("en-IN")} లోపు ఉండాలి.`,
      });
    }
  }

  // 5. Student Status
  if (rule.studentOnly) {
    if (profile.isStudent !== undefined) {
      if (profile.isStudent) {
        satisfied.push({
          parameter: "StudentStatus",
          status: "MET",
          labelEn: "Active Student Enrollment",
          labelTe: "విద్యార్థి నమోదు",
          detailEn: "Enrolled in recognized educational institution.",
          detailTe: "గుర్తింపు పొందిన విద్యాసంస్థలో చదువుతున్నట్లు ధృవీకరించబడింది.",
        });
      } else {
        failed.push({
          parameter: "StudentStatus",
          status: "UNMET",
          labelEn: "Active Student Requirement",
          labelTe: "విద్యార్థి అర్హత",
          detailEn: "This scheme is strictly for enrolled students.",
          detailTe: "ఈ పథకం కేవలం చదువుకుంటున్న విద్యార్థులకు మాత్రమే.",
        });
      }
    } else {
      uncertain.push({
        parameter: "StudentStatus",
        status: "UNCERTAIN",
        labelEn: "Student Status",
        labelTe: "విద్యార్థి స్థితి",
        detailEn: "Please indicate whether the applicant is a currently enrolled student.",
        detailTe: "దరఖాస్తుదారు ప్రస్తుతం చదువుకుంటున్న విద్యార్థినా కాదా అనేది స్పష్టం చేయండి.",
      });
    }
  }

  // 6. Farmer Status & Land
  if (rule.farmerOnly) {
    if (profile.isFarmer !== undefined) {
      if (profile.isFarmer) {
        satisfied.push({
          parameter: "FarmerStatus",
          status: "MET",
          labelEn: "Cultivating Farmer / Tenant Status",
          labelTe: "రైతు / కౌలు రైతు అర్హత",
          detailEn: "Farmer status confirmed.",
          detailTe: "సాగు చేస్తున్న రైతుగా గుర్తించబడింది.",
        });

        // Land check
        if (rule.maxLandAcresWet && profile.landAcresWet !== undefined) {
          if (profile.landAcresWet <= rule.maxLandAcresWet) {
            satisfied.push({
              parameter: "WetLandAcres",
              status: "MET",
              labelEn: `Wetland Holding (Max ${rule.maxLandAcresWet} acres)`,
              labelTe: `తడి భూమి పరిమితి (${rule.maxLandAcresWet} ఎకరాలు)`,
              detailEn: `Your wetland holding (${profile.landAcresWet} acres) is within the permitted limit.`,
              detailTe: `మీ తడి భూమి (${profile.landAcresWet} ఎకరాలు) అనుమతించిన పరిమితిలో ఉంది.`,
            });
          } else {
            failed.push({
              parameter: "WetLandAcres",
              status: "UNMET",
              labelEn: `Wetland Holding (Max ${rule.maxLandAcresWet} acres)`,
              labelTe: `భూమి పరిమితి మించింది`,
              detailEn: `Declared wetland of ${profile.landAcresWet} acres exceeds the ceiling of ${rule.maxLandAcresWet} acres.`,
              detailTe: `మీ తడి భూమి (${profile.landAcresWet} ఎకరాలు) గరిష్ట పరిమితి (${rule.maxLandAcresWet} ఎకరాలు) కంటే ఎక్కువ.`,
            });
          }
        }
      } else {
        failed.push({
          parameter: "FarmerStatus",
          status: "UNMET",
          labelEn: "Cultivating Farmer Status",
          labelTe: "రైతు అర్హత",
          detailEn: "This scheme requires cultivating farmer or registered tenant status.",
          detailTe: "ఈ పథకం కేవలం సాగుచేసే రైతులకు లేదా కౌలు రైతులకు మాత్రమే వర్తిస్తుంది.",
        });
      }
    } else {
      uncertain.push({
        parameter: "FarmerStatus",
        status: "UNCERTAIN",
        labelEn: "Farmer Status",
        labelTe: "రైతు వివరాలు",
        detailEn: "Farmer/tenant status was not specified.",
        detailTe: "రైతు లేదా కౌలు రైతు వివరాలు పేర్కొనలేదు.",
      });
    }
  }

  // 7. Senior Citizen Status
  if (rule.seniorCitizenOnly) {
    if (profile.age !== undefined) {
      if (profile.age >= 60 || profile.isSeniorCitizen) {
        satisfied.push({
          parameter: "SeniorCitizenStatus",
          status: "MET",
          labelEn: "Senior Citizen Status (Age 60+)",
          labelTe: "వృద్ధాప్య అర్హత (60 ఏళ్లు పైబడిన వారు)",
          detailEn: `Age ${profile.age} qualifies as a senior citizen.`,
          detailTe: `మీ వయస్సు ${profile.age} సంవత్సరాలు వృద్ధాప్య పింఛను పరిధిలోకి వస్తుంది.`,
        });
      } else {
        failed.push({
          parameter: "SeniorCitizenStatus",
          status: "UNMET",
          labelEn: "Senior Citizen Status (Age 60+)",
          labelTe: "వృద్ధాప్య అర్హత",
          detailEn: `Applicant must be at least 60 years of age. Current age: ${profile.age}.`,
          detailTe: `ఈ పథకానికి కనీసం 60 ఏళ్లు నిండి ఉండాలి. ప్రస్తుత వయస్సు: ${profile.age}.`,
        });
      }
    } else if (profile.isSeniorCitizen !== undefined) {
      if (profile.isSeniorCitizen) {
        satisfied.push({
          parameter: "SeniorCitizenStatus",
          status: "MET",
          labelEn: "Senior Citizen Status",
          labelTe: "వయోవృద్ధుల అర్హత",
          detailEn: "Senior citizen status declared.",
          detailTe: "వయోవృద్ధుడిగా నిర్ధారించబడింది.",
        });
      } else {
        failed.push({
          parameter: "SeniorCitizenStatus",
          status: "UNMET",
          labelEn: "Senior Citizen Requirement",
          labelTe: "వృద్ధాప్య అర్హత",
          detailEn: "Applicant is not a senior citizen.",
          detailTe: "దరఖాస్తుదారు వయోవృద్ధులు కారు.",
        });
      }
    }
  }

  // 8. State Residence
  if (rule.stateResidentOnly) {
    if (profile.stateResident !== undefined) {
      if (profile.stateResident) {
        satisfied.push({
          parameter: "StateResident",
          status: "MET",
          labelEn: "Resident of Andhra Pradesh",
          labelTe: "ఆంధ్రప్రదేశ్ నివాసి",
          detailEn: "Permanent residency in Andhra Pradesh confirmed.",
          detailTe: "ఆంధ్రప్రదేశ్ శాశ్వత నివాసిగా ధృవీకరించబడింది.",
        });
      } else {
        failed.push({
          parameter: "StateResident",
          status: "UNMET",
          labelEn: "Resident of Andhra Pradesh",
          labelTe: "రాష్ట్ర నివాస అర్హత",
          detailEn: "Scheme is restricted to permanent residents of Andhra Pradesh.",
          detailTe: "ఈ పథకం కేవలం ఆంధ్రప్రదేశ్ శాశ్వత నివాసితులకు మాత్రమే పరిమితం.",
        });
      }
    } else {
      uncertain.push({
        parameter: "StateResident",
        status: "UNCERTAIN",
        labelEn: "State Residency",
        labelTe: "రాష్ట్ర నివాస వివరాలు",
        detailEn: "State residency not indicated. Required: Andhra Pradesh.",
        detailTe: "రాష్ట్ర నివాస వివరాలు తెలపలేదు. ఆంధ్రప్రదేశ్ నివాసం అవసరం.",
      });
    }
  }

  // Determine overall status & score
  let status: MatchStatus = "ELIGIBLE";
  const totalConditions = satisfied.length + failed.length + uncertain.length;

  if (failed.length > 0) {
    status = "NOT_ELIGIBLE";
  } else if (uncertain.length > 0 && satisfied.length === 0) {
    status = "NEEDS_MORE_INFO";
  } else if (uncertain.length > 0) {
    status = "LIKELY_ELIGIBLE";
  } else {
    status = "ELIGIBLE";
  }

  // Calculate deterministic score percentage
  let score = 0;
  if (totalConditions > 0) {
    if (failed.length > 0) {
      // Partial score for met conditions, capped below 40%
      score = Math.round((satisfied.length / totalConditions) * 35);
    } else if (uncertain.length > 0) {
      score = Math.round(50 + (satisfied.length / totalConditions) * 40);
    } else {
      score = 100;
    }
  } else {
    score = 75; // Open scheme
  }

  return {
    schemeId: scheme.id,
    schemeTitleEn: scheme.titleEn,
    schemeTitleTe: scheme.titleTe,
    category: scheme.category,
    officialUrl: scheme.officialUrl,
    status,
    score,
    satisfiedConditions: satisfied,
    failedConditions: failed,
    missingOrUncertainConditions: uncertain,
    disclaimerEn:
      "Preliminary guidance based on published government rules. Official sanction is granted solely by the competent departmental authorities or Grama/Ward Sachivalayam following physical verification and social audit.",
    disclaimerTe:
      "ప్రభుత్వ మార్గదర్శకాల ఆధారంగా రూపొందించిన ప్రాథమిక మార్గదర్శక సమాచారం మాత్రమే. అధికారిక ఆమోదం సంబంధిత శాఖ లేదా గ్రామ/వార్డు సచివాలయ క్షేత్రస్థాయి పరిశీలన మరియు సోషల్ ఆడిట్ తర్వాత మాత్రమే లభిస్తుంది.",
  };
}

export function evaluateAllSchemes(
  schemes: SchemeItem[],
  profile: UserProfileInput
): AssessmentResult[] {
  return schemes
    .map((scheme) => evaluateSchemeEligibility(scheme, profile))
    .sort((a, b) => {
      // Sort by status priority: ELIGIBLE first, then LIKELY_ELIGIBLE, then NEEDS_MORE_INFO, then NOT_ELIGIBLE
      const statusWeight: Record<MatchStatus, number> = {
        ELIGIBLE: 4,
        LIKELY_ELIGIBLE: 3,
        NEEDS_MORE_INFO: 2,
        NOT_ELIGIBLE: 1,
      };
      if (statusWeight[a.status] !== statusWeight[b.status]) {
        return statusWeight[b.status] - statusWeight[a.status];
      }
      return b.score - a.score;
    });
}

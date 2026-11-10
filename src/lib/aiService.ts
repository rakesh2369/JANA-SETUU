import { SchemeItem } from "@/types/scheme";
import initialSchemesData from "@/data/initialSchemes.json";

interface GroundedSource {
  schemeId: string;
  title: string;
  officialUrl: string;
  department: string;
  verifiedDate: string;
}

export interface AssistantResponse {
  answer: string;
  language: "en" | "te";
  sources: GroundedSource[];
  followUps: string[];
}

// Detect language from query
export function detectLanguage(text: string): "en" | "te" {
  // Telugu Unicode block is \u0C00-\u0C7F
  const teluguRegex = /[\u0C00-\u0C7F]/;
  return teluguRegex.test(text) ? "te" : "en";
}

// Keyword & Semantic Scoring across Scheme corpus
export function retrieveRelevantSchemes(
  query: string,
  schemes: SchemeItem[] = initialSchemesData as unknown as SchemeItem[],
  topK: number = 3
): { scheme: SchemeItem; score: number }[] {
  const queryLower = query.toLowerCase().trim();
  const queryTokens = queryLower
    .split(/[\s,?.!/\\-]+/)
    .filter((t) => t.length > 2);

  const scored = schemes.map((scheme) => {
    let score = 0;

    const searchableText = [
      scheme.titleEn,
      scheme.titleTe,
      scheme.slug,
      scheme.category,
      scheme.departmentEn,
      scheme.departmentTe,
      scheme.descriptionEn,
      scheme.descriptionTe,
      scheme.benefitsEn,
      scheme.benefitsTe,
      scheme.eligibilitySummaryEn,
      scheme.eligibilitySummaryTe,
      scheme.targetBeneficiaries.join(" "),
      scheme.portalName,
    ]
      .join(" ")
      .toLowerCase();

    // Exact title match boost
    if (searchableText.includes(queryLower)) {
      score += 15;
    }

    // Keyword match
    for (const token of queryTokens) {
      if (searchableText.includes(token)) {
        score += 3;
      }
    }

    // Specific domain intent matches
    if (
      (queryTokens.includes("farmer") ||
        queryTokens.includes("రైతు") ||
        queryTokens.includes("agriculture") ||
        queryTokens.includes("crop") ||
        queryTokens.includes("పంట")) &&
      scheme.category === "Agriculture"
    ) {
      score += 10;
    }

    if (
      (queryTokens.includes("student") ||
        queryTokens.includes("విద్యార్థి") ||
        queryTokens.includes("college") ||
        queryTokens.includes("scholarship") ||
        queryTokens.includes("fee") ||
        queryTokens.includes("ఫీజు") ||
        queryTokens.includes("చదువు")) &&
      scheme.category === "Education"
    ) {
      score += 10;
    }

    if (
      (queryTokens.includes("woman") ||
        queryTokens.includes("women") ||
        queryTokens.includes("మహిళ") ||
        queryTokens.includes("తల్లి") ||
        queryTokens.includes("mother")) &&
      (scheme.category === "Women Welfare" || scheme.targetBeneficiaries.includes("Women"))
    ) {
      score += 8;
    }

    if (
      (queryTokens.includes("pension") ||
        queryTokens.includes("పింఛను") ||
        queryTokens.includes("పెన్షన్") ||
        queryTokens.includes("senior") ||
        queryTokens.includes("వృద్ధాప్య") ||
        queryTokens.includes("widow") ||
        queryTokens.includes("వితంతు") ||
        queryTokens.includes("దివ్యాంగ")) &&
      scheme.category === "Pensions & Social Security"
    ) {
      score += 10;
    }

    if (
      (queryTokens.includes("health") ||
        queryTokens.includes("hospital") ||
        queryTokens.includes("ఆరోగ్య") ||
        queryTokens.includes("చికిత్స") ||
        queryTokens.includes("ఆసుపత్రి") ||
        queryTokens.includes("doctor")) &&
      scheme.category === "Healthcare"
    ) {
      score += 10;
    }

    return { scheme, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// Generate contextual AI response with RAG
export async function generateJanSetuResponse(
  query: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[] = [],
  schemesList: SchemeItem[] = initialSchemesData as unknown as SchemeItem[]
): Promise<AssistantResponse> {
  const lang = detectLanguage(query);
  const relevantMatches = retrieveRelevantSchemes(query, schemesList, 3);
  const matchedSchemes = relevantMatches.map((m) => m.scheme);

  // If Gemini API Key is configured, attempt call to Google Gemini API
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (geminiApiKey && geminiApiKey.trim() !== "" && geminiApiKey !== "your-gemini-api-key-here") {
    try {
      const response = await callGeminiAPI(query, matchedSchemes, lang, geminiApiKey);
      if (response) {
        return response;
      }
    } catch (e) {
      console.warn("Gemini API call encountered error, falling back to deterministic synthesis engine:", e);
    }
  }

  // Built-in intelligent synthesis engine (Zero-dependency fallback that guarantees 100% uptime and grounding)
  return generateDeterministicRAGResponse(query, matchedSchemes, lang);
}

async function callGeminiAPI(
  query: string,
  schemes: SchemeItem[],
  lang: "en" | "te",
  apiKey: string
): Promise<AssistantResponse | null> {
  const contextText = schemes
    .map(
      (s) => `
Scheme Title: ${s.titleEn} (${s.titleTe})
Department: ${s.departmentEn} (${s.departmentTe})
Category: ${s.category}
Level: ${s.level} | State: ${s.state}
Official Portal: ${s.officialUrl} (${s.portalName})
Helpline: ${s.helpline || "1902"}
Description: ${s.descriptionEn}
Benefits: ${s.benefitsEn}
Eligibility Summary: ${s.eligibilitySummaryEn}
Required Documents: ${s.requiredDocs.map((d) => d.nameEn).join(", ")}
Application Process: ${s.applicationProcessEn}
Last Verified Date: ${s.verifiedDate}
`
    )
    .join("\n---\n");

  const systemInstruction = `
You are JanSetu Assistant, a trustworthy, public-service AI assistant for Indian government schemes, focusing on Andhra Pradesh.
IMPORTANT GUIDELINES:
1. Ground your answer strictly in the provided verified scheme context below.
2. DO NOT invent eligibility conditions, application dates, or monetary amounts not present in the context.
3. If information is not found in the context, explicitly acknowledge: "This specific information is not in our verified records, please verify with the official portal."
4. Respond in ${lang === "te" ? "Telugu (తెలుగు)" : "English"}.
5. Format your response cleanly with bullet points and bold section headers.
6. Always remind the user that this is informational guidance and not an official government approval.
`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${systemInstruction}\n\nVERIFIED SCHEMES CONTEXT:\n${contextText}\n\nUSER QUESTION: ${query}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 900,
    },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error(`Gemini API returned status ${res.status}`);
  }

  const data = await res.json();
  const answerText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!answerText) return null;

  const sources: GroundedSource[] = schemes.map((s) => ({
    schemeId: s.id,
    title: lang === "te" ? s.titleTe : s.titleEn,
    officialUrl: s.officialUrl,
    department: lang === "te" ? s.departmentTe : s.departmentEn,
    verifiedDate: s.verifiedDate,
  }));

  const followUps = generateFollowUps(query, schemes, lang);

  return {
    answer: answerText,
    language: lang,
    sources,
    followUps,
  };
}

function generateDeterministicRAGResponse(
  query: string,
  matchedSchemes: SchemeItem[],
  lang: "en" | "te"
): AssistantResponse {
  // If no scheme was retrieved
  if (matchedSchemes.length === 0) {
    if (lang === "te") {
      return {
        answer: `నమస్కారం. మీరు అడిగిన ప్రశ్నకు సరిపోలే నిర్ధారిత పథక వివరాలు మా ప్రస్తుత డేటాబేస్‌లో కనుగొనబడలేదు.\n\nJanSetu ప్లాట్‌ఫారమ్ ప్రస్తుతం ఆంధ్రప్రదేశ్ మరియు కేంద్ర ప్రభుత్వానికి చెందిన ఎంపిక చేసిన విద్య, వ్యవసాయ, మహిళా సంక్షేమ, ఆరోగ్య మరియు సామాజిక భద్రతా పథకాలను అందిస్తోంది.\n\nదయచేసి మీ ప్రశ్నను మరింత వివరంగా అడగండి (ఉదాహరణకు: "రైతు భరోసా అర్హతలు", "విద్యా దీవెనకు కావాల్సిన డాక్యుమెంట్లు", "ఆరోగ్యశ్రీ పరిమితి").`,
        language: "te",
        sources: [],
        followUps: [
          "రైతు భరోసా పథకం గురించి చెప్పండి",
          "జగనన్న విద్యా దీవెన అర్హతలు ఏమిటి?",
          "ఆరోగ్యశ్రీలో ఎంతవరకు ఉచిత వైద్యం లభిస్తుంది?",
        ],
      };
    } else {
      return {
        answer: `Hello. We could not find a verified government scheme matching your specific query in our current catalog.\n\nJanSetu currently indexes verified schemes from Andhra Pradesh and the Central Government across Education, Agriculture, Women Welfare, Pensions, Healthcare, and Housing.\n\nPlease refine your search with specific keywords (e.g., "Rythu Bharosa eligibility", "Vidya Deevena required documents", "Aarogyasri medical coverage limit").`,
        language: "en",
        sources: [],
        followUps: [
          "Tell me about YSR Rythu Bharosa",
          "What are the eligibility criteria for Vidya Deevena?",
          "How much cashless treatment is covered under Dr. YSR Aarogyasri?",
        ],
      };
    }
  }

  const primary = matchedSchemes[0];
  const sources: GroundedSource[] = matchedSchemes.map((s) => ({
    schemeId: s.id,
    title: lang === "te" ? s.titleTe : s.titleEn,
    officialUrl: s.officialUrl,
    department: lang === "te" ? s.departmentTe : s.departmentEn,
    verifiedDate: s.verifiedDate,
  }));

  const queryLower = query.toLowerCase();
  const isAskingDocs =
    queryLower.includes("document") ||
    queryLower.includes("docs") ||
    queryLower.includes("పత్రాలు") ||
    queryLower.includes("సర్టిఫికెట్") ||
    queryLower.includes("కావాల్సినవి");
  const isAskingHowToApply =
    queryLower.includes("apply") ||
    queryLower.includes("process") ||
    queryLower.includes("portal") ||
    queryLower.includes("దరఖాస్తు") ||
    queryLower.includes("విధానం");
  const isAskingEligibility =
    queryLower.includes("eligible") ||
    queryLower.includes("eligibility") ||
    queryLower.includes("criteria") ||
    queryLower.includes("income") ||
    queryLower.includes("అర్హత") ||
    queryLower.includes("ఆదాయం");

  let answer = "";

  if (lang === "te") {
    answer += `### **${primary.titleTe}**\n\n`;
    answer += `**సంబంధిత శాఖ:** ${primary.departmentTe}\n\n`;

    if (isAskingDocs) {
      answer += `**అవసరమైన ముఖ్య ధృవీకరణ పత్రాలు (Required Documents):**\n`;
      primary.requiredDocs.forEach((doc, idx) => {
        answer += `${idx + 1}. **${doc.nameTe}** (${doc.category})\n   - వివరణ: ${doc.descriptionTe}\n   - ఎక్కడ పొందవచ్చు: ${doc.whereToGetTe}\n`;
      });
    } else if (isAskingHowToApply) {
      answer += `**దరఖాస్తు విధానం (Application Procedure):**\n${primary.applicationProcessTe}\n\n`;
      answer += `**అధికారిక వెబ్‌సైట్:** [${primary.portalName}](${primary.officialUrl})\n`;
      if (primary.helpline) {
        answer += `**హెల్ప్‌లైన్ నంబర్:** ${primary.helpline}\n`;
      }
    } else if (isAskingEligibility) {
      answer += `**అర్హత నిబంధనలు (Eligibility Criteria):**\n${primary.eligibilitySummaryTe}\n\n`;
      answer += `**లభించే ప్రయోజనాలు (Benefits):**\n${primary.benefitsTe}\n`;
    } else {
      answer += `**పథకం ముఖ్యాంశాలు:**\n${primary.descriptionTe}\n\n`;
      answer += `**పథకం ప్రయోజనాలు:**\n${primary.benefitsTe}\n\n`;
      answer += `**అర్హత నిబంధనలు:**\n${primary.eligibilitySummaryTe}\n\n`;
      answer += `**అధికారిక పోర్టల్:** [${primary.portalName}](${primary.officialUrl})\n`;
    }

    if (matchedSchemes.length > 1) {
      answer += `\n---\n**సంబంధిత ఇతర పథకాలు:**\n`;
      matchedSchemes.slice(1).forEach((s) => {
        answer += `- **${s.titleTe}**: ${s.benefitsTe.slice(0, 100)}...\n`;
      });
    }

    answer += `\n> ⚠️ **గమనిక:** JanSetu అందించే ఈ సమాచారం అధికారిక మార్గదర్శకాల ఆధారంగా రూపొందించిన ప్రాథమిక మార్గదర్శకత్వం మాత్రమే. అధికారిక అనుమతులు సంబంధిత ప్రభుత్వ కార్యాలయం లేదా సచివాలయం పరిశీలనపై ఆధారపడి ఉంటాయి.`;
  } else {
    answer += `### **${primary.titleEn}**\n\n`;
    answer += `**Nodal Department:** ${primary.departmentEn}\n\n`;

    if (isAskingDocs) {
      answer += `**Required Document Checklist:**\n`;
      primary.requiredDocs.forEach((doc, idx) => {
        answer += `${idx + 1}. **${doc.nameEn}** (${doc.category})\n   - Purpose: ${doc.descriptionEn}\n   - Issuing Authority: ${doc.whereToGetEn}\n`;
      });
    } else if (isAskingHowToApply) {
      answer += `**Official Application Procedure:**\n${primary.applicationProcessEn}\n\n`;
      answer += `**Official Portal:** [${primary.portalName}](${primary.officialUrl})\n`;
      if (primary.helpline) {
        answer += `**Official Helpline:** ${primary.helpline}\n`;
      }
    } else if (isAskingEligibility) {
      answer += `**Published Eligibility Criteria:**\n${primary.eligibilitySummaryEn}\n\n`;
      answer += `**Scheme Benefits:**\n${primary.benefitsEn}\n`;
    } else {
      answer += `**Overview:**\n${primary.descriptionEn}\n\n`;
      answer += `**Key Benefits:**\n${primary.benefitsEn}\n\n`;
      answer += `**Published Eligibility Criteria:**\n${primary.eligibilitySummaryEn}\n\n`;
      answer += `**Official Application Portal:** [${primary.portalName}](${primary.officialUrl})\n`;
    }

    if (matchedSchemes.length > 1) {
      answer += `\n---\n**Other Closely Related Schemes:**\n`;
      matchedSchemes.slice(1).forEach((s) => {
        answer += `- **${s.titleEn}**: ${s.benefitsEn.slice(0, 110)}...\n`;
      });
    }

    answer += `\n> ⚠️ **Important Disclaimer:** JanSetu provides grounded informational guidance based on verified departmental guidelines. It does not replace official government channels or guarantee scheme sanctions.`;
  }

  const followUps = generateFollowUps(query, matchedSchemes, lang);

  return {
    answer,
    language: lang,
    sources,
    followUps,
  };
}

function generateFollowUps(
  query: string,
  schemes: SchemeItem[],
  lang: "en" | "te"
): string[] {
  if (schemes.length === 0) return [];
  const s = schemes[0];

  if (lang === "te") {
    return [
      `${s.titleTe} కోసం దరఖాస్తు విధానం ఏమిటి?`,
      `${s.titleTe} కు అవసరమైన సర్టిఫికెట్ల జాబితా చూపించు`,
      `నా కుటుంబ ఆదాయం ₹2 లక్షలు అయితే నేను ఈ పథకానికి అర్హుడనా?`,
      `అధికారిక పోర్టల్ మరియు హెల్ప్‌లైన్ వివరాలు ఏమిటి?`,
    ];
  }

  return [
    `What are the step-by-step application instructions for ${s.titleEn}?`,
    `What documents do I need to prepare for ${s.titleEn}?`,
    `Am I eligible if my family income is ₹2 Lakhs per year?`,
    `Where is the official application portal and helpline?`,
  ];
}

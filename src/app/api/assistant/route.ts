import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateJanSetuResponse } from "@/lib/aiService";
import { SchemeItem } from "@/types/scheme";

export async function POST(req: Request) {
  try {
    const { query, history } = await req.json();

    if (!query || typeof query !== "string" || query.trim() === "") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Load active verified schemes from DB
    const dbSchemes = await prisma.scheme.findMany({
      where: { isActive: true },
      include: { rules: true },
    });

    const parsedSchemes: SchemeItem[] = dbSchemes.map((s) => {
      let requiredDocs = [];
      let targetBeneficiaries: string[] = [];
      try {
        requiredDocs = JSON.parse(s.requiredDocsJson);
      } catch (e) {}
      try {
        targetBeneficiaries = JSON.parse(s.targetBeneficiariesJson);
      } catch (e) {}

      return {
        id: s.id,
        slug: s.slug,
        titleEn: s.titleEn,
        titleTe: s.titleTe,
        category: s.category as any,
        departmentEn: s.departmentEn,
        departmentTe: s.departmentTe,
        level: s.level as "State" | "Central",
        state: s.state,
        descriptionEn: s.descriptionEn,
        descriptionTe: s.descriptionTe,
        benefitsEn: s.benefitsEn,
        benefitsTe: s.benefitsTe,
        eligibilitySummaryEn: s.eligibilitySummaryEn,
        eligibilitySummaryTe: s.eligibilitySummaryTe,
        requiredDocs,
        applicationProcessEn: s.applicationProcessEn,
        applicationProcessTe: s.applicationProcessTe,
        officialUrl: s.officialUrl,
        portalName: s.portalName,
        helpline: s.helpline,
        deadline: s.deadline,
        verifiedDate: s.verifiedDate.toISOString(),
        isVerified: s.isVerified,
        isActive: s.isActive,
        targetBeneficiaries,
      };
    });

    const response = await generateJanSetuResponse(query, history || [], parsedSchemes);

    return NextResponse.json({
      success: true,
      answer: response.answer,
      language: response.language,
      sources: response.sources,
      followUps: response.followUps,
    });
  } catch (error: any) {
    console.error("AI assistant error:", error);
    return NextResponse.json(
      { error: "Failed to generate assistant response" },
      { status: 500 }
    );
  }
}


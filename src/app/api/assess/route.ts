import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { evaluateAllSchemes } from "@/lib/eligibilityEngine";
import { SchemeItem, UserProfileInput } from "@/types/scheme";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const profile: UserProfileInput = body.profile;

    if (!profile) {
      return NextResponse.json({ error: "Profile input is required" }, { status: 400 });
    }

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

      const rules = s.rules.map((r) => {
        let allowedCastes: string[] = ["ALL"];
        let specificConditions: string[] = [];
        try {
          allowedCastes = JSON.parse(r.allowedCastesJson);
        } catch (e) {}
        try {
          specificConditions = r.conditionsJson ? JSON.parse(r.conditionsJson) : [];
        } catch (e) {}

        return {
          minAge: r.minAge,
          maxAge: r.maxAge,
          gender: r.gender as "ALL" | "FEMALE" | "MALE",
          allowedCastes,
          maxAnnualIncome: r.maxAnnualIncome,
          studentOnly: r.studentOnly,
          minEducationLevel: r.minEducationLevel,
          farmerOnly: r.farmerOnly,
          maxLandAcresWet: r.maxLandAcresWet,
          maxLandAcresDry: r.maxLandAcresDry,
          womanOnly: r.womanOnly,
          seniorCitizenOnly: r.seniorCitizenOnly,
          disabilityMinPercent: r.disabilityMinPercent,
          stateResidentOnly: r.stateResidentOnly,
          specificConditions,
        };
      });

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
        rules,
      };
    });

    // Run deterministic rules evaluation
    const results = evaluateAllSchemes(parsedSchemes, profile);

    // If user is authenticated, store assessment record
    const user = await getCurrentUser();
    if (user) {
      try {
        await prisma.assessmentRecord.create({
          data: {
            userId: user.id,
            profileInputJson: JSON.stringify(profile),
            matchedSchemesJson: JSON.stringify(results.slice(0, 10)),
          },
        });
      } catch (err) {
        console.warn("Could not persist assessment record:", err);
      }
    }

    return NextResponse.json({
      success: true,
      results,
      evaluatedCount: parsedSchemes.length,
    });
  } catch (error: any) {
    console.error("Assessment error:", error);
    return NextResponse.json({ error: "Failed to perform assessment" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { SchemeItem } from "@/types/scheme";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const category = searchParams.get("category") || "";
    const level = searchParams.get("level") || "";
    const beneficiary = searchParams.get("beneficiary") || "";

    const dbSchemes = await prisma.scheme.findMany({
      where: {
        isActive: true,
        ...(category && category !== "ALL" ? { category } : {}),
        ...(level && level !== "ALL" ? { level } : {}),
      },
      include: {
        rules: true,
      },
      orderBy: {
        verifiedDate: "desc",
      },
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

    let filtered = parsedSchemes;

    // Filter by beneficiary if provided
    if (beneficiary && beneficiary !== "ALL") {
      filtered = filtered.filter((s) =>
        s.targetBeneficiaries.some((b) => b.toLowerCase().includes(beneficiary.toLowerCase()))
      );
    }

    // Filter by search keyword
    if (search) {
      filtered = filtered.filter((s) => {
        const text = [
          s.titleEn,
          s.titleTe,
          s.descriptionEn,
          s.descriptionTe,
          s.benefitsEn,
          s.departmentEn,
          s.departmentTe,
          s.category,
        ]
          .join(" ")
          .toLowerCase();
        return text.includes(search);
      });
    }

    return NextResponse.json({ schemes: filtered });
  } catch (error: any) {
    console.error("Error fetching schemes:", error);
    return NextResponse.json({ error: "Failed to fetch schemes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      titleEn,
      titleTe,
      slug,
      category,
      departmentEn,
      departmentTe,
      level,
      state,
      descriptionEn,
      descriptionTe,
      benefitsEn,
      benefitsTe,
      eligibilitySummaryEn,
      eligibilitySummaryTe,
      requiredDocs,
      applicationProcessEn,
      applicationProcessTe,
      officialUrl,
      portalName,
      helpline,
      deadline,
      targetBeneficiaries,
      rules,
    } = body;

    const createdScheme = await prisma.scheme.create({
      data: {
        slug: slug || titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        titleEn,
        titleTe: titleTe || titleEn,
        category: category || "Welfare",
        departmentEn,
        departmentTe: departmentTe || departmentEn,
        level: level || "State",
        state: state || "Andhra Pradesh",
        descriptionEn,
        descriptionTe: descriptionTe || descriptionEn,
        benefitsEn,
        benefitsTe: benefitsTe || benefitsEn,
        eligibilitySummaryEn,
        eligibilitySummaryTe: eligibilitySummaryTe || eligibilitySummaryEn,
        requiredDocsJson: JSON.stringify(requiredDocs || []),
        applicationProcessEn,
        applicationProcessTe: applicationProcessTe || applicationProcessEn,
        officialUrl,
        portalName: portalName || "Official Portal",
        helpline,
        deadline,
        verifiedDate: new Date(),
        isVerified: true,
        isActive: true,
        targetBeneficiariesJson: JSON.stringify(targetBeneficiaries || ["General Citizens"]),
      },
    });

    if (rules && Array.isArray(rules) && rules.length > 0) {
      for (const r of rules) {
        await prisma.eligibilityRule.create({
          data: {
            schemeId: createdScheme.id,
            minAge: r.minAge ? parseInt(r.minAge) : null,
            maxAge: r.maxAge ? parseInt(r.maxAge) : null,
            gender: r.gender || "ALL",
            allowedCastesJson: JSON.stringify(r.allowedCastes || ["ALL"]),
            maxAnnualIncome: r.maxAnnualIncome ? parseFloat(r.maxAnnualIncome) : null,
            studentOnly: !!r.studentOnly,
            minEducationLevel: r.minEducationLevel || null,
            farmerOnly: !!r.farmerOnly,
            maxLandAcresWet: r.maxLandAcresWet ? parseFloat(r.maxLandAcresWet) : null,
            maxLandAcresDry: r.maxLandAcresDry ? parseFloat(r.maxLandAcresDry) : null,
            womanOnly: !!r.womanOnly,
            seniorCitizenOnly: !!r.seniorCitizenOnly,
            disabilityMinPercent: r.disabilityMinPercent ? parseInt(r.disabilityMinPercent) : null,
            stateResidentOnly: r.stateResidentOnly !== undefined ? !!r.stateResidentOnly : true,
            conditionsJson: JSON.stringify(r.specificConditions || []),
          },
        });
      }
    }

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        adminId: user.id,
        action: "SCHEME_CREATED",
        entityType: "SCHEME",
        entityId: createdScheme.id,
        detailsJson: JSON.stringify({
          titleEn: createdScheme.titleEn,
          category: createdScheme.category,
          createdBy: user.email,
        }),
      },
    });

    return NextResponse.json({ success: true, scheme: createdScheme });
  } catch (error: any) {
    console.error("Error creating scheme:", error);
    return NextResponse.json({ error: error.message || "Failed to create scheme" }, { status: 500 });
  }
}


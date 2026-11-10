import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const scheme = await prisma.scheme.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        rules: true,
      },
    });

    if (!scheme) {
      return NextResponse.json({ error: "Scheme not found" }, { status: 404 });
    }

    let requiredDocs = [];
    let targetBeneficiaries: string[] = [];
    try {
      requiredDocs = JSON.parse(scheme.requiredDocsJson);
    } catch (e) {}
    try {
      targetBeneficiaries = JSON.parse(scheme.targetBeneficiariesJson);
    } catch (e) {}

    const rules = scheme.rules.map((r) => {
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

    const parsed = {
      id: scheme.id,
      slug: scheme.slug,
      titleEn: scheme.titleEn,
      titleTe: scheme.titleTe,
      category: scheme.category,
      departmentEn: scheme.departmentEn,
      departmentTe: scheme.departmentTe,
      level: scheme.level,
      state: scheme.state,
      descriptionEn: scheme.descriptionEn,
      descriptionTe: scheme.descriptionTe,
      benefitsEn: scheme.benefitsEn,
      benefitsTe: scheme.benefitsTe,
      eligibilitySummaryEn: scheme.eligibilitySummaryEn,
      eligibilitySummaryTe: scheme.eligibilitySummaryTe,
      requiredDocs,
      applicationProcessEn: scheme.applicationProcessEn,
      applicationProcessTe: scheme.applicationProcessTe,
      officialUrl: scheme.officialUrl,
      portalName: scheme.portalName,
      helpline: scheme.helpline,
      deadline: scheme.deadline,
      verifiedDate: scheme.verifiedDate.toISOString(),
      isVerified: scheme.isVerified,
      isActive: scheme.isActive,
      targetBeneficiaries,
      rules,
    };

    return NextResponse.json({ scheme: parsed });
  } catch (error: any) {
    console.error("Error retrieving scheme:", error);
    return NextResponse.json({ error: "Failed to load scheme" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    const existing = await prisma.scheme.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      return NextResponse.json({ error: "Scheme not found" }, { status: 404 });
    }

    const updated = await prisma.scheme.update({
      where: { id: existing.id },
      data: {
        titleEn: body.titleEn ?? existing.titleEn,
        titleTe: body.titleTe ?? existing.titleTe,
        category: body.category ?? existing.category,
        departmentEn: body.departmentEn ?? existing.departmentEn,
        departmentTe: body.departmentTe ?? existing.departmentTe,
        level: body.level ?? existing.level,
        state: body.state ?? existing.state,
        descriptionEn: body.descriptionEn ?? existing.descriptionEn,
        descriptionTe: body.descriptionTe ?? existing.descriptionTe,
        benefitsEn: body.benefitsEn ?? existing.benefitsEn,
        benefitsTe: body.benefitsTe ?? existing.benefitsTe,
        eligibilitySummaryEn: body.eligibilitySummaryEn ?? existing.eligibilitySummaryEn,
        eligibilitySummaryTe: body.eligibilitySummaryTe ?? existing.eligibilitySummaryTe,
        requiredDocsJson: body.requiredDocs ? JSON.stringify(body.requiredDocs) : existing.requiredDocsJson,
        applicationProcessEn: body.applicationProcessEn ?? existing.applicationProcessEn,
        applicationProcessTe: body.applicationProcessTe ?? existing.applicationProcessTe,
        officialUrl: body.officialUrl ?? existing.officialUrl,
        portalName: body.portalName ?? existing.portalName,
        helpline: body.helpline ?? existing.helpline,
        deadline: body.deadline ?? existing.deadline,
        verifiedDate: body.verifiedDate ? new Date(body.verifiedDate) : new Date(),
        isVerified: body.isVerified !== undefined ? body.isVerified : existing.isVerified,
        isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: user.id,
        action: "SCHEME_UPDATED",
        entityType: "SCHEME",
        entityId: updated.id,
        detailsJson: JSON.stringify({
          updatedFields: Object.keys(body),
          updatedBy: user.email,
        }),
      },
    });

    return NextResponse.json({ success: true, scheme: updated });
  } catch (error: any) {
    console.error("Error updating scheme:", error);
    return NextResponse.json({ error: "Failed to update scheme" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const existing = await prisma.scheme.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      return NextResponse.json({ error: "Scheme not found" }, { status: 404 });
    }

    await prisma.scheme.delete({
      where: { id: existing.id },
    });

    await prisma.auditLog.create({
      data: {
        adminId: user.id,
        action: "SCHEME_DELETED",
        entityType: "SCHEME",
        entityId: existing.id,
        detailsJson: JSON.stringify({
          titleEn: existing.titleEn,
          deletedBy: user.email,
        }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting scheme:", error);
    return NextResponse.json({ error: "Failed to delete scheme" }, { status: 500 });
  }
}

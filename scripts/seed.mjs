import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding JanSetu database...");

  const schemesJsonPath = path.join(__dirname, "../src/data/initialSchemes.json");
  const initialSchemes = JSON.parse(fs.readFileSync(schemesJsonPath, "utf-8"));

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.savedScheme.deleteMany();
  await prisma.assessmentRecord.deleteMany();
  await prisma.eligibilityRule.deleteMany();
  await prisma.scheme.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminPasswordHash = await bcrypt.hash("Admin@12345", 10);
  const citizenPasswordHash = await bcrypt.hash("Citizen@12345", 10);

  const admin = await prisma.user.create({
    data: {
      name: "JanSetu Portal Administrator",
      email: "admin@jansetu.gov.in",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      state: "Andhra Pradesh",
      preferredLanguage: "en",
    },
  });

  const citizen = await prisma.user.create({
    data: {
      name: "Ramesh Babu Vangaveeti",
      email: "citizen@jansetu.gov.in",
      passwordHash: citizenPasswordHash,
      role: "CITIZEN",
      state: "Andhra Pradesh",
      preferredLanguage: "te",
    },
  });

  console.log(`Created admin (${admin.email}) and citizen (${citizen.email})`);

  // Create Schemes & Rules
  for (const s of initialSchemes) {
    const createdScheme = await prisma.scheme.create({
      data: {
        id: s.id,
        slug: s.slug,
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
        requiredDocsJson: JSON.stringify(s.requiredDocs),
        applicationProcessEn: s.applicationProcessEn,
        applicationProcessTe: s.applicationProcessTe,
        officialUrl: s.officialUrl,
        portalName: s.portalName,
        helpline: s.helpline,
        deadline: s.deadline,
        verifiedDate: new Date(s.verifiedDate),
        isVerified: s.isVerified,
        isActive: s.isActive,
        targetBeneficiariesJson: JSON.stringify(s.targetBeneficiaries),
      },
    });

    if (s.rules && s.rules.length > 0) {
      for (const r of s.rules) {
        await prisma.eligibilityRule.create({
          data: {
            schemeId: createdScheme.id,
            minAge: r.minAge ?? null,
            maxAge: r.maxAge ?? null,
            gender: r.gender,
            allowedCastesJson: JSON.stringify(r.allowedCastes),
            maxAnnualIncome: r.maxAnnualIncome ?? null,
            studentOnly: r.studentOnly,
            minEducationLevel: r.minEducationLevel ?? null,
            farmerOnly: r.farmerOnly,
            maxLandAcresWet: r.maxLandAcresWet ?? null,
            maxLandAcresDry: r.maxLandAcresDry ?? null,
            womanOnly: r.womanOnly,
            seniorCitizenOnly: r.seniorCitizenOnly,
            disabilityMinPercent: r.disabilityMinPercent ?? null,
            stateResidentOnly: r.stateResidentOnly,
            conditionsJson: JSON.stringify(r.specificConditions || []),
          },
        });
      }
    }
  }

  // Create sample Saved Schemes for the citizen
  await prisma.savedScheme.create({
    data: {
      userId: citizen.id,
      schemeId: "sch_rythu_bharosa",
      notes: "Registered for upcoming Kharif crop season, checking CCRC verification status.",
    },
  });

  await prisma.savedScheme.create({
    data: {
      userId: citizen.id,
      schemeId: "sch_aarogyasri",
      notes: "Family health coverage verification.",
    },
  });

  // Create sample checklist items for citizen
  await prisma.checklistItem.create({
    data: {
      userId: citizen.id,
      schemeId: "sch_rythu_bharosa",
      documentName: "Pattadar Passbook / 1B RoR Extract",
      isPrepared: true,
      notes: "Downloaded from Meebhoomi portal with digital signature.",
    },
  });

  await prisma.checklistItem.create({
    data: {
      userId: citizen.id,
      schemeId: "sch_rythu_bharosa",
      documentName: "Aadhaar Card (Linked with Mobile)",
      isPrepared: true,
      notes: "Biometric KYC verified at Village Secretariat.",
    },
  });

  await prisma.checklistItem.create({
    data: {
      userId: citizen.id,
      schemeId: "sch_rythu_bharosa",
      documentName: "E-Crop Booking Acknowledgment Receipt",
      isPrepared: false,
      notes: "Need to visit RBK on Monday for field capture.",
    },
  });

  // Create sample Audit Logs
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: "SCHEME_VERIFIED",
      entityType: "SCHEME",
      entityId: "sch_rythu_bharosa",
      detailsJson: JSON.stringify({
        change: "Verified 2025 Kharif benefit guidelines against AP Agriculture G.O.",
        verifiedDate: new Date().toISOString(),
      }),
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: "RULE_UPDATED",
      entityType: "RULE",
      entityId: "sch_aarogyasri",
      detailsJson: JSON.stringify({
        change: "Increased annual family coverage cap to ₹25 Lakhs as per latest cabinet decision.",
      }),
    },
  });

  console.log("Seeding completed successfully! 10 schemes and initial records seeded.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const schemeId = searchParams.get("schemeId");

    const items = await prisma.checklistItem.findMany({
      where: {
        userId: user.id,
        ...(schemeId ? { schemeId } : {}),
      },
      include: {
        scheme: {
          select: {
            id: true,
            titleEn: true,
            titleTe: true,
            category: true,
            slug: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ checklist: items });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch checklist" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { schemeId, documentName, isPrepared, notes } = await req.json();

    if (!schemeId || !documentName) {
      return NextResponse.json({ error: "Scheme ID and Document Name are required" }, { status: 400 });
    }

    const item = await prisma.checklistItem.upsert({
      where: {
        userId_schemeId_documentName: {
          userId: user.id,
          schemeId,
          documentName,
        },
      },
      update: {
        isPrepared: isPrepared !== undefined ? isPrepared : true,
        notes: notes !== undefined ? notes : undefined,
      },
      create: {
        userId: user.id,
        schemeId,
        documentName,
        isPrepared: isPrepared !== undefined ? isPrepared : false,
        notes: notes || "",
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error("Checklist error:", error);
    return NextResponse.json({ error: "Failed to update checklist item" }, { status: 500 });
  }
}


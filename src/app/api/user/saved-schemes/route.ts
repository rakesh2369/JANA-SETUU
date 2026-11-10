import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await prisma.savedScheme.findMany({
      where: { userId: user.id },
      include: {
        scheme: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ savedSchemes: saved });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch saved schemes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { schemeId, notes } = await req.json();
    if (!schemeId) {
      return NextResponse.json({ error: "Scheme ID is required" }, { status: 400 });
    }

    const saved = await prisma.savedScheme.upsert({
      where: {
        userId_schemeId: {
          userId: user.id,
          schemeId,
        },
      },
      update: { notes },
      create: {
        userId: user.id,
        schemeId,
        notes,
      },
      include: { scheme: true },
    });

    return NextResponse.json({ success: true, savedScheme: saved });
  } catch (error: any) {
    console.error("Save scheme error:", error);
    return NextResponse.json({ error: "Failed to save scheme" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const schemeId = searchParams.get("schemeId");

    if (!schemeId) {
      return NextResponse.json({ error: "Scheme ID is required" }, { status: 400 });
    }

    await prisma.savedScheme.deleteMany({
      where: {
        userId: user.id,
        schemeId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to remove saved scheme" }, { status: 500 });
  }
}

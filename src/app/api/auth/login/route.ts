import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSessionValue, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, isDemo, demoRole } = await req.json();

    let targetEmail = email;
    if (isDemo) {
      targetEmail = demoRole === "ADMIN" ? "admin@jansetu.gov.in" : "citizen@jansetu.gov.in";
    }

    if (!targetEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!isDemo) {
      const isMatch = await bcrypt.compare(password || "", user.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    }

    const sessionPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "CITIZEN" | "ADMIN",
      state: user.state,
      preferredLanguage: user.preferredLanguage as "en" | "te",
    };

    const cookieValue = createSessionValue(sessionPayload);

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: cookieValue,
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


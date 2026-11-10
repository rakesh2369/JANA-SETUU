import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export interface AuthSessionUser {
  id: string;
  name: string;
  email: string;
  role: "CITIZEN" | "ADMIN";
  state: string;
  preferredLanguage: "en" | "te";
}

const SESSION_COOKIE_NAME = "jansetu_session";

export async function getCurrentUser(): Promise<AuthSessionUser | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) return null;

    const parsed = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString("utf-8"));
    if (!parsed?.id) return null;

    const user = await prisma.user.findUnique({
      where: { id: parsed.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        state: true,
        preferredLanguage: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "CITIZEN" | "ADMIN",
      state: user.state,
      preferredLanguage: user.preferredLanguage as "en" | "te",
    };
  } catch (e) {
    return null;
  }
}

export function createSessionValue(user: AuthSessionUser): string {
  return Buffer.from(JSON.stringify(user)).toString("base64");
}

export { SESSION_COOKIE_NAME };

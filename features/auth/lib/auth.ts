import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";
import { jsonError } from "@/lib/api";
import { HTTP_STATUS } from "@/lib/constants";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

export { ADMIN_SESSION_COOKIE } from "@/lib/constants";

export function getAdminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD;
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function hasAdminSession(): Promise<boolean> {
  if (!getAdminPassword()) return false;
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  return session?.value === "1";
}

/** Returns 401 Response if not authenticated; null if authenticated. */
export async function requireAdminSession(): Promise<Response | null> {
  const isAuthenticated = await hasAdminSession();
  if (!isAuthenticated) {
    return jsonError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
  }
  return null;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export function verifyAdminPassword(input: string): boolean {
  const password = getAdminPassword();
  if (!password) return false;
  return input === password;
}

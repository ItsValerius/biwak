import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/features/auth";

const ADMIN_LOGIN_PATH = "/admin/login";

function isAdminProtectedPath(pathname: string): boolean {
  return pathname.startsWith("/admin") && !pathname.startsWith(ADMIN_LOGIN_PATH);
}

export function proxy(request: NextRequest) {
  if (!isAdminProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  const session = request.cookies.get(ADMIN_SESSION_COOKIE);
  if (!session?.value) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { User } from "@/types";

interface PersistedAuthState {
  state?: {
    user?: User | null;
  };
}

const PROTECTED_ROUTES = ["/cart", "/orders"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/signin", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Đọc user từ Zustand persist cookie
  const authCookie = request.cookies.get("florio-auth")?.value;
  let user: User | null = null;

  if (authCookie) {
    try {
      const parsed = JSON.parse(authCookie) as PersistedAuthState;
      user = parsed?.state?.user ?? null;
    } catch {
      user = null;
    }
  }

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isLoggedIn)
      return NextResponse.redirect(new URL("/signin", request.url));
    if (!isAdmin)
      return NextResponse.redirect(new URL("/products", request.url));
  }

  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isLoggedIn)
      return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (isLoggedIn)
      return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};

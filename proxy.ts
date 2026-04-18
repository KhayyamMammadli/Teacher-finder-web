import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/profile"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requiresAuth = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!requiresAuth) {
    return NextResponse.next();
  }

  const token = request.cookies.get("tf_token")?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};

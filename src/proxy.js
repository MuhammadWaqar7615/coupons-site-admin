import { NextResponse } from "next/server";
import { decodeJwt } from "jose";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = request.cookies.get("session")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/account/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const payload = decodeJwt(sessionCookie);
      if (!payload || !payload.exp || payload.exp * 1000 < Date.now()) {
        const loginUrl = new URL("/account/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("session");
        return response;
      }

      const role = String(payload.user?.role || "").toLowerCase();
      if (role !== "admin" && role !== "administration") {
        const loginUrl = new URL("/account/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch (err) {
      const loginUrl = new URL("/account/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

// import { NextResponse } from "next/server";
import { NextResponse, type NextRequest } from "next/server";
import { BACKEND_BASE_URL } from "./app/_lib/const";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const headers = new Headers(request.headers);
  headers.set("x-current-path", pathname);
  const url = request.nextUrl.clone();
  const sessionCookie = request.cookies.get("connect.sid");
  if (pathname === "/" || (!sessionCookie && pathname.startsWith("/app"))) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const response = await fetch(`${BACKEND_BASE_URL}/api/auth/auth-status`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: `${sessionCookie?.name}=${sessionCookie?.value}`,
    },
  });
  const data = await response.json();
  if (data.success && pathname.startsWith("/login")) {
    url.pathname = "/app";
    return NextResponse.redirect(url);
  } else if (!data.success && pathname.startsWith("/app")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/", "/login", "/app/:path*"],
};

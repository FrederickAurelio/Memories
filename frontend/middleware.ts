// import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BACKEND_BASE_URL } from "./app/_lib/const";

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("connect.sid");
  const response = await fetch(`${BACKEND_BASE_URL}/api/auth/auth-status`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: `${sessionCookie?.name}=${sessionCookie?.value}`,
    },
  });
  const data = await response.json();
  console.log(data);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    // "/app",
    "/login",
  ],
};

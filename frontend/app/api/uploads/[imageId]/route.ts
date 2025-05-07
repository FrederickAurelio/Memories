import { BACKEND_BASE_URL, FRONTEND_BASE_URL } from "@/app/_lib/const";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const imageId = request.url.replace(`${FRONTEND_BASE_URL}/api/`, "");
  const cookieStore = await cookies();
  const cookiesidValue = cookieStore.get("connect.sid");

  const response = await fetch(`${BACKEND_BASE_URL}/${imageId}`, {
    method: "GET",
    headers: {
      Cookie: `connect.sid=${cookiesidValue?.value}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    return new NextResponse(null, { status: response.status });
  }

  const contentType =
    response.headers.get("content-type") || "application/octet-stream";
  const buffer = await response.arrayBuffer();

  return new NextResponse(Buffer.from(buffer), {
    status: 200,
    headers: {
      "Content-Type": contentType,
    },
  });
}

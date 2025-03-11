import { BACKEND_BASE_URL } from "@/app/_lib/const";
import { FetchResponse } from "@/app/_lib/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const verificationToken = searchParams.get("verificationToken");
  const userId = searchParams.get("userId");

  if (verificationToken && userId) {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/auth/verify-email/${verificationToken}/${userId}`,
      );
      const data = (await response.json()) as FetchResponse;

      return NextResponse.redirect(
        `${origin}/login?verify=${data.success}&message=${data.message}`,
      );
    } catch (error) {
      throw new Error(`Something's wrong: ${error}`);
    }
  }
}

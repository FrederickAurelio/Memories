import { BACKEND_BASE_URL } from "@/app/_lib/const";
import { FetchResponse } from "@/app/_lib/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const cookieStore = await cookies();
  const tokenState = cookieStore.get("latestCSRFToken");
  const cookiesidValue = cookieStore.get("connect.sid");
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (code && state && state === tokenState?.value) {
    try {
      cookieStore.delete("latestCSRFToken");
      const response = await fetch(`${BACKEND_BASE_URL}/api/auth/sign-github`, {
        method: "POST",
        body: JSON.stringify({ code }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `connect.sid=${cookiesidValue?.value}`,
        },
      });
      const data = (await response.json()) as FetchResponse;
      if (data.success) {
        const cookieObj: Record<string, string> = {};
        const setCookieHeader = response.headers.get("set-cookie");
        if (setCookieHeader) {
          const cookieArray = setCookieHeader.split(";");
          cookieArray.forEach((cookie) => {
            const [key, value] = cookie.split("=");
            if (key && value) {
              cookieObj[key.trim()] = value.trim();
            }
          });
        }
        cookieStore.set("connect.sid", cookieObj["connect.sid"], {
          expires: new Date(cookieObj["Expires"]),
          path: "/",
          httpOnly: true,
          secure: false,
          maxAge: 60 * 60 * 24 * 14,
        });
      }
      return NextResponse.redirect(
        `${origin}/login?verify=${data.success}&message=${data.message}`,
      );
    } catch (error) {
      throw new Error(`Something's wrong: ${error}`);
    }
  } else {
    return NextResponse.redirect(`${origin}/login`);
  }
}

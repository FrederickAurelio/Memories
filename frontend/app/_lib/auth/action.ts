"use server";

import { cookies } from "next/headers";
import { BACKEND_BASE_URL } from "../const";
import { FetchResponse } from "../types";

export async function registerUserByEmail(
  _: FetchResponse | null,
  formData: FormData,
) {
  try {
    const { firstName, lastName, password, email } =
      Object.fromEntries(formData);

    if (!firstName || !password || !email) {
      return null;
    }

    const cookieStore = await cookies();
    const cookiesidValue = cookieStore.get("connect.sid");

    const response = await fetch(
      `${BACKEND_BASE_URL}/api/auth/register-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `connect.sid=${cookiesidValue?.value}`,
        },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName, email, password }),
      },
    );

    const data = (await response.json()) as FetchResponse & {
      data: { email: string };
    };
    return data;
  } catch (error) {
    throw new Error(`Something's wrong: ${error}`);
  }
}

export async function loginUserByEmail(
  _: FetchResponse | null,
  formData: FormData | null,
) {
  if (formData === null) {
    return {
      success: false,
      message: "",
      errors: {},
    };
  }
  try {
    const { password, email } = Object.fromEntries(formData);

    if (!password || !email) {
      return null;
    }

    const cookieStore = await cookies();
    const cookiesidValue = cookieStore.get("connect.sid");

    const response = await fetch(`${BACKEND_BASE_URL}/api/auth/login-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `connect.sid=${cookiesidValue?.value}`,
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

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

    const data = (await response.json()) as FetchResponse;
    if (data.success) {
      const recentLogin = cookieStore.get("recent-login") || "";
      let recentLoginArray = recentLogin ? recentLogin.value.split(";") : [];
      if (recentLoginArray.includes(email.toString()))
        recentLoginArray = recentLoginArray.filter(
          (s) => s !== email.toString(),
        );
      recentLoginArray = [email.toString(), ...recentLoginArray];
      recentLoginArray = recentLoginArray.slice(0, 4);
      cookieStore.set("recent-login", recentLoginArray.join(";"), {
        path: "/",
        maxAge: 60 * 60 * 24 * 30 * 2,
      });
    }
    return data;
  } catch (error) {
    throw new Error(`Something's wrong: ${error}`);
  }
}

export async function sendEmailVerification(email: string) {
  try {
    console.log("HEREEEE");
    const response = await fetch(
      `${BACKEND_BASE_URL}/api/auth//resend-verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );
    const data = (await response.json()) as FetchResponse;
    return data;
  } catch (error) {
    throw new Error(`Something's wrong: ${error}`);
  }
}

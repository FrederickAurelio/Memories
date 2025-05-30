"use server";

import { cookies } from "next/headers";
import { BACKEND_BASE_URL, FRONTEND_BASE_URL } from "../const";
import { FetchResponse, UserProfile } from "../types";
import { redirect } from "next/navigation";
import * as crypto from "crypto";
import { setCookieRecentLogin, setCookieSid } from "../helpers";

export async function getCurrentUserWithCookies() {
  try {
    const cookieStore = await cookies();
    const cookiesidValue = cookieStore.get("connect.sid");

    const response = await fetch(`${BACKEND_BASE_URL}/api/auth/auth-status`, {
      method: "GET",
      headers: {
        Cookie: `connect.sid=${cookiesidValue?.value}`,
      },
      credentials: "include",
    });

    const data = (await response.json()) as FetchResponse & {
      data: {
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
        isPublicProfile: boolean;
        _id: string;
      };
    };
    return data;
  } catch (error) {
    throw new Error(`Something's wrong: ${error}`);
  }
}

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
  let data: FetchResponse;
  const { password, email } = Object.fromEntries(formData);
  if (!password || !email) {
    return null;
  }
  const cookieStore = await cookies();
  const cookiesidValue = cookieStore.get("connect.sid");
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/auth/login-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `connect.sid=${cookiesidValue?.value}`,
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    data = (await response.json()) as FetchResponse;
    if (data.success) setCookieSid(response, cookieStore);
  } catch (error) {
    throw new Error(`Something's wrong: ${error}`);
  }
  if (data.success) {
    setCookieRecentLogin(cookieStore, email.toString());
    redirect(`/app`);
  }
  return data;
}

export async function sendEmailVerification(email: string) {
  try {
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

export async function getUserProfile() {
  const cookieStore = await cookies();
  const recentLogin = cookieStore.get("recent-login") || {
    name: "recent-login",
    value: "",
  };
  const emails = recentLogin.value;
  const response = await fetch(
    `${BACKEND_BASE_URL}/api/auth/users-profile?emails=${emails}`,
  );
  const recentLoginUser = (await response.json()) as FetchResponse & {
    data: UserProfile[];
  };

  return recentLoginUser.data;
}

export async function forgetPassword(
  _: FetchResponse | null,
  formData: FormData,
) {
  try {
    const { email } = Object.fromEntries(formData);
    if (!email) return null;
    const response = await fetch(
      `${BACKEND_BASE_URL}/api/auth/forget-password`,
      {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-type": "application/json",
        },
      },
    );
    const data = (await response.json()) as FetchResponse;
    return data;
  } catch (error) {
    throw new Error(`Something's wrong: ${error}`);
  }
}

export async function resetPassowrd(
  _: FetchResponse | null,
  formData: FormData,
) {
  const { newPassword, repeatNewPassword, resetToken, userId } =
    Object.fromEntries(formData);

  if (!newPassword || !repeatNewPassword) return null;
  if (newPassword !== repeatNewPassword)
    return {
      success: false,
      message: "Passwords do not match.",
      errors: {
        repeatNewPassword:
          "The repeated password does not match the new password.",
      },
    };
  const response = await fetch(
    `${BACKEND_BASE_URL}/api/auth/reset-password?resetToken=${resetToken}&userId=${userId}`,
    {
      method: "PUT",
      body: JSON.stringify({ newPassword }),
      headers: {
        "Content-type": "application/json",
      },
    },
  );
  const data = (await response.json()) as FetchResponse;
  if (data.success) {
    redirect(`/login?verify=true&message=${data.message}`);
  } else {
    return data;
  }
}

export async function signWithGithub() {
  const cookieStore = await cookies();
  const state = crypto.randomBytes(16).toString("hex");
  cookieStore.set("latestCSRFToken", state, {
    httpOnly: true,
  });
  const clientId = process.env.GITHUB_CLIENT_ID;

  const link = `https://github.com/login/oauth/authorize?client_id=${clientId}&response_type=code&scope=user:email&redirect_uri=${FRONTEND_BASE_URL}/auth/github/callback&state=${state}`;
  redirect(link);
}

"use server";

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

    const response = await fetch(`${BACKEND_BASE_URL}/api/auth/register-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data = (await response.json()) as FetchResponse;
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(`Something's wrong: ${error}`);
  }
}

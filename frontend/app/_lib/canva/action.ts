"use server";

import { cookies } from "next/headers";
import { ElementType, FetchResponse } from "../types";
import { BACKEND_BASE_URL } from "../const";

export async function saveCanvaDesign(
  canvaTitle: string,
  elements: ElementType[],
) {
  try {
    if (!canvaTitle || elements.length <= 0) return null;

    console.log(canvaTitle);
    console.log(elements);

    const cookieStore = await cookies();
    const cookiesidValue = cookieStore.get("connect.sid");

    return;
    // json -> formData, body jg
    const response = await fetch(`${BACKEND_BASE_URL}/canva`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `connect.sid=${cookiesidValue?.value}`,
      },
      credentials: "include",
      body: JSON.stringify({}),
    });

    const data = (await response.json()) as FetchResponse;
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(`Something's wrong: ${error}`);
  }
}

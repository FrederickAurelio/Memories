"use server";

import { cookies } from "next/headers";
import { getCurrentUserWithCookies } from "../auth/action";
import { BACKEND_BASE_URL } from "../const";
import { base64ToFileWithName } from "../helpers";
import {
  CanvaDataType,
  ElementType,
  FetchResponse,
  PhotoMetadata,
} from "../types";

export async function saveCanvaDesign(
  canvaTitle: string,
  elements: ElementType[],
  canvaId?: string,
) {
  try {
    if (!canvaTitle || elements.length <= 0) return null;

    const cookieStore = await cookies();
    const cookiesidValue = cookieStore.get("connect.sid");

    const responseUser = await fetch(
      `${BACKEND_BASE_URL}/api/auth/auth-status`,
      {
        method: "GET",
        headers: {
          Cookie: `connect.sid=${cookiesidValue?.value}`,
        },
        credentials: "include",
      },
    );

    const userData = (await responseUser.json()) as FetchResponse & {
      data: { _id: string };
    };
    if (!userData.success) return userData;
    const userId = userData.data._id;

    const image: File[] = [];
    const newElements = elements.map((el) => {
      if (
        (el.type === "photo" || el.type === "sticker") &&
        el.src.startsWith("data:image/")
      ) {
        const { file, filename } = base64ToFileWithName(
          el.src,
          `${userId}-${el.id}`,
        );
        image.push(file);
        return { ...el, src: `uploads/${filename}` };
      } else return el;
    });

    const formData = new FormData();

    image.forEach((img) => {
      formData.append("images", img);
    });

    const responseImage = await fetch(
      `${BACKEND_BASE_URL}/api/canva/save-image`,
      {
        method: "POST",
        headers: {
          Cookie: `connect.sid=${cookiesidValue?.value}`,
        },
        credentials: "include",
        body: formData,
      },
    );

    const dataImage = (await responseImage.json()) as FetchResponse;
    if (!dataImage.success) return dataImage;

    const response = await fetch(
      `${BACKEND_BASE_URL}/api/canva${canvaId ? `/${canvaId}` : ""}`,
      {
        method: canvaId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `connect.sid=${cookiesidValue?.value}`,
        },
        credentials: "include",
        body: JSON.stringify({
          title: canvaTitle,
          elements: newElements,
        }),
      },
    );
    const data = (await response.json()) as FetchResponse & {
      data: {
        canvaId: string;
      };
    };
    return data;
  } catch (error) {
    throw new Error(`Something's wrong: ${error}`);
  }
}

export async function updateCanvaPhotoInfo(
  canvaTitle: string | undefined,
  photoDescriptions: PhotoMetadata[],
  canvaId: string | undefined,
) {
  if (!canvaTitle || photoDescriptions.length <= 0 || !canvaId) return null;
  try {
    const cookieStore = await cookies();
    const cookiesidValue = cookieStore.get("connect.sid");

    const body = JSON.stringify({
      title: canvaTitle,
      photoDescriptions: photoDescriptions,
    });

    const response = await fetch(
      `${BACKEND_BASE_URL}/api/canva/edit-info/${canvaId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `connect.sid=${cookiesidValue?.value}`,
        },
        credentials: "include",
        body: body,
      },
    );

    const data = (await response.json()) as FetchResponse;
    return data;
  } catch (error) {
    throw new Error(`Something's wrong: ${error}`);
  }
}

// If want to view only directly fetch from backend
export async function getCanvaForEditOnly(canvaId: string) {
  try {
    if (!canvaId) return null;

    const cookieStore = await cookies();
    const cookiesidValue = cookieStore.get("connect.sid");
    const response = await fetch(`${BACKEND_BASE_URL}/api/canva/${canvaId}`, {
      method: "GET",
      headers: {
        Cookie: `connect.sid=${cookiesidValue?.value}`,
      },
      credentials: "include",
    });
    const canvaData = (await response.json()) as FetchResponse & CanvaDataType;

    const userData = await getCurrentUserWithCookies();
    if (canvaData.data.userId._id.toString() !== userData.data._id.toString()) {
      return {
        success: false,
        message: "Access denied to this design.",
        errors: {},
      } as FetchResponse & CanvaDataType;
    }
    return canvaData;
  } catch (error) {
    throw new Error(`Something's wrong: ${error}`);
  }
}

import { cookies } from "next/headers";
import CanvaPage from "./CanvaPage";
import { BACKEND_BASE_URL } from "@/app/_lib/const";
import { CanvaDataType, FetchResponse } from "@/app/_lib/types";

async function canvaPage({ params }: { params: Promise<{ canvaId: string }> }) {
  const { canvaId } = await params;

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

  return (
    <div className="flex h-full w-full items-center justify-between">
      <CanvaPage canvaData={canvaData} />
    </div>
  );
}

export default canvaPage;

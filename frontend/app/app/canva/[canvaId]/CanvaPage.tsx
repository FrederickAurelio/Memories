"use client";

import { CanvaDataType, FetchResponse } from "@/app/_lib/types";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
const ViewOnlyCanva = dynamic(
  () => import("@/canva_components/ViewOnlyCanva"),
  {
    ssr: false,
  },
);

function CanvaPage({
  canvaData,
}: {
  canvaData: FetchResponse & CanvaDataType;
}) {
  const router = useRouter();
  useEffect(() => {
    if (canvaData.message.includes("not found")) {
      toast.error(canvaData.message);
      router.push("/app");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex h-full w-full flex-grow flex-col gap-3 py-4 pr-[14px]">
        a
      </div>

      <div
        className={`aspect-video w-[1200] flex-shrink-0 bg-white shadow-[0_1px_20px_rgba(38,38,38,0.20)]`}
      >
        <ViewOnlyCanva
          photoDescriptions={canvaData?.data?.photoDescriptions}
          photoImageMode={"view"}
          elements={canvaData?.data?.elements || []}
        />
      </div>
    </>
  );
}

export default CanvaPage;

"use client";
import { CanvaDataType, FetchResponse } from "@/app/_lib/types";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DescForm from "./DescForm";

const ViewOnlyCanva = dynamic(
  () => import("@/canva_components/ViewOnlyCanva"),
  {
    ssr: false,
  },
);

type Props = {
  canvaData: (FetchResponse & CanvaDataType) | null;
};

function EditDescPage({ canvaData }: Props) {
  const [isSelectedId, setIsSelectedId] = useState<null | string>(null);
  const router = useRouter();
  useEffect(() => {
    if (!canvaData?.success) {
      if (canvaData?.message.includes("not found")) {
        toast.error(
          "Canva with specified ID is not found, returning back to app",
        );
      } else if (canvaData?.message.includes("Access denied")) {
        toast.error(
          "You have no permission to edit this canva, returning back to app",
        );
      } else toast.error("Something went wrong!");

      const timeout = setTimeout(() => {
        router.push("/app");
      }, 1500);

      return () => clearTimeout(timeout); // clean up
    }
  }, [canvaData, router]);

  useEffect(() => {
    toast.info(
      "Select a polaroid photo in the canvas to edit its information here.",
    );
  }, []);
  return (
    <>
      <div className="flex h-full w-full flex-grow flex-col gap-3 py-4 pr-[14px]">
        <DescForm
          canvaId={canvaData?.data?._id}
          isSelectedId={isSelectedId}
          canvaTitle={canvaData?.data?.title}
          photoDescriptions={canvaData?.data?.photoDescriptions || []}
        />
      </div>

      <div
        className={`aspect-video w-[1200] flex-shrink-0 bg-white shadow-[0_1px_20px_rgba(38,38,38,0.20)]`}
      >
        <ViewOnlyCanva
          photoImageMode={"edit"}
          isSelectedId={isSelectedId}
          setIsSelectedId={setIsSelectedId}
          elements={canvaData?.data?.elements || []}
        />
      </div>
    </>
  );
}

export default EditDescPage;

"use client";
import {
  CanvaDataType,
  FetchResponse
} from "@/app/_lib/types";
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

type Props = {
  canvaData: (FetchResponse & CanvaDataType) | null;
};

function EditDescPage({ canvaData }: Props) {
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
  return (
    <div className="relative w-fit">
      <div
        className={`aspect-video w-[1200] bg-white shadow-[0_1px_20px_rgba(38,38,38,0.20)]`}
      >
        <ViewOnlyCanva elements={canvaData?.data?.elements || []} />
      </div>
    </div>
  );
}

export default EditDescPage;

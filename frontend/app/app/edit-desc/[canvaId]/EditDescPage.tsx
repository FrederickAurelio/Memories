"use client";
import { ElementType } from "@/app/_lib/types";
import dynamic from "next/dynamic";

const ViewOnlyCanva = dynamic(
  () => import("@/canva_components/ViewOnlyCanva"),
  {
    ssr: false,
  },
);

function EditDescPage({ elements }: { elements: ElementType[] }) {
  return (
    <div className="relative w-fit">
      <div
        className={`aspect-video w-[1200] bg-white shadow-[0_1px_20px_rgba(38,38,38,0.20)]`}
      >
        <ViewOnlyCanva elements={elements} />
      </div>
    </div>
  );
}

export default EditDescPage;

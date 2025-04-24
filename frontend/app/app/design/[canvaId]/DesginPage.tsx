"use client";

import { ElementProvider } from "@/app/_context/ElementContext";
import dynamic from "next/dynamic";
import Toolbox from "./Toolbox";
const Canva = dynamic(() => import("@/canva_components/Canva"), {
  ssr: false,
});

function ToolContent() {
  return (
    <ElementProvider>
      <div className="col-span-1 flex items-center justify-end">
        <Toolbox />
      </div>
      <div className="col-start-2 col-end-[15] flex w-full items-center justify-center p-4">
        <div className="aspect-video h-full bg-white shadow-[0_1px_20px_rgba(38,38,38,0.20)]">
          <Canva />
        </div>
      </div>
    </ElementProvider>
  );
}

export default ToolContent;

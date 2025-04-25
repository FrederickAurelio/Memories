"use client";

import { ElementProvider } from "@/app/_context/ElementContext";
import { toolboxOptions } from "@/app/_lib/const";
import dynamic from "next/dynamic";
import EditToolBar from "./EditToolBar";
import Toolbox from "./Toolbox";
const Canva = dynamic(() => import("@/canva_components/Canva"), {
  ssr: false,
});

function DesignPage() {
  return (
    <ElementProvider>
      <div className="relative col-start-1 col-end-2 flex items-center justify-end">
        <Toolbox toolboxOptions={toolboxOptions} />
      </div>

      <div className="col-start-2 col-end-[15] flex w-full flex-col items-center justify-center p-3">
        <EditToolBar />
        <div
          className={`aspect-video w-[1200] bg-white shadow-[0_1px_20px_rgba(38,38,38,0.20)]`}
        >
          <Canva />
        </div>
      </div>
    </ElementProvider>
  );
}

export default DesignPage;

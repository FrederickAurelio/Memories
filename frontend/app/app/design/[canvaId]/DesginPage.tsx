"use client";

import { ElementProvider } from "@/app/_context/ElementContext";
import { toolboxOptions } from "@/app/_lib/const";
import dynamic from "next/dynamic";
import { Ref, SetStateAction, useCallback, useState } from "react";
import EditToolBar from "./EditToolBar";
import Toolbox from "./Toolbox";
const Canva = dynamic(() => import("@/canva_components/Canva"), {
  ssr: false,
});

function DesignPage() {
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);

  const w = containerEl?.offsetWidth ? containerEl.offsetWidth / 16 : null;
  const y = containerEl?.offsetHeight ? containerEl?.offsetHeight / 9 : null;

  const containerRef = useCallback(
    (node: SetStateAction<null | HTMLDivElement>) => {
      if (node !== null) {
        setContainerEl(node);
      }
    },
    [],
  );

  return (
    <ElementProvider>
      <div className="relative col-start-1 col-end-2 flex items-center justify-end">
        <Toolbox toolboxOptions={toolboxOptions} />
      </div>

      <div
        ref={containerRef as Ref<HTMLDivElement> | undefined}
        className="col-start-2 col-end-[15] flex w-full flex-col items-center justify-center bg-red-100 p-3"
      >
        <EditToolBar />
        {containerEl && w && y && (
          <div
            className={`aspect-video ${w > y ? "h-full" : "w-full"} bg-white shadow-[0_1px_20px_rgba(38,38,38,0.20)]`}
          >
            <Canva />
          </div>
        )}
      </div>
    </ElementProvider>
  );
}

export default DesignPage;

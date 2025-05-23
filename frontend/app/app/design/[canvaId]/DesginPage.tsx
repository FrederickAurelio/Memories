"use client";

import { useElements } from "@/app/_context/ElementContext";
import { mainToolboxOptions } from "@/app/_lib/const";
import { Redo2Icon, Undo2Icon, ZoomIn, ZoomOut } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import EditToolBar from "./EditToolBar";
import LoadStateDialog from "./LoadStateDialog";
import SaveCanvaButton from "./SaveCanvaButton";
import Toolbox from "./Toolbox";
const Canva = dynamic(() => import("@/canva_components/Canva"), {
  ssr: false,
});

function DesignPage({ canvaId }: { canvaId: string }) {
  const { zoom, curStateStack, stateStack, isSelectedId } = useElements();
  const [isDesign, setIsDesign] = useState(false);
  return (
    <>
      {isDesign && (
        <>
          <div className="relative col-start-1 col-end-2 flex flex-col items-end justify-around">
            <SaveCanvaButton />

            <Toolbox
              toolboxOptions={[
                {
                  id: "undo",
                  type: "tool",
                  name: "Undo (Ctrl + Z)",
                  icon: Undo2Icon,
                  disabled: curStateStack >= stateStack.length - 1,
                },
                {
                  id: "redo",
                  type: "tool",
                  name: "Redo (Ctrl + Shift + Z)",
                  icon: Redo2Icon,
                  disabled: curStateStack <= 0,
                },
              ]}
            />
            <Toolbox toolboxOptions={mainToolboxOptions} />
            <Toolbox
              toolboxOptions={[
                {
                  id: "zoom-in",
                  type: "tool",
                  name: "Zoom-In",
                  icon: ZoomIn,
                  disabled: zoom >= 200,
                },
                {
                  id: "zoom-out",
                  type: "tool",
                  name: "Zoom-Out",
                  icon: ZoomOut,
                  disabled: zoom <= 10,
                },
              ]}
            />
          </div>

          <div className="relative col-start-2 col-end-[15] flex w-full flex-col items-center justify-center p-3">
            {isSelectedId && <EditToolBar />}
            <div
              style={{
                transform: `scaleX(${zoom}%) scaleY(${zoom}%)`,
              }}
              className={`aspect-video w-[1200] bg-white shadow-[0_1px_20px_rgba(38,38,38,0.20)]`}
            >
              <Canva />
            </div>
          </div>
        </>
      )}
      <LoadStateDialog canvaId={canvaId} setIsDesign={setIsDesign} />
    </>
  );
}

export default DesignPage;

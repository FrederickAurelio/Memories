"use client";

import { useState } from "react";
import Toolbox from "./Toolbox";
import dynamic from "next/dynamic";
const Canva = dynamic(() => import("@/canva_components/Canva"), {
  ssr: false,
});

function ToolContent() {
  const [selectedTool, isSelectedTool] = useState("select");
  function handleSelect(s: string) {
    isSelectedTool(s);
  }
  return (
    <>
      <div className="col-span-1 flex items-center justify-end">
        <Toolbox selectedTool={selectedTool} onSelect={handleSelect} />
      </div>
      <div className="col-start-2 col-end-[15] flex w-full items-center justify-center p-4">
        <div className="aspect-video h-full bg-white shadow-[0_1px_20px_rgba(38,38,38,0.20)]">
          <Canva handleSelect={handleSelect} selectedTool={selectedTool} />
        </div>
      </div>
    </>
  );
}

export default ToolContent;

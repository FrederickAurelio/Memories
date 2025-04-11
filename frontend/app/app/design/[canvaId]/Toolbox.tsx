"use client";
import { toolboxOptions } from "@/app/_lib/const";
import Tool from "./Tool";
import ToolMenu from "./ToolMenu";
import { ToolType } from "@/app/_lib/types";

function Toolbox({
  onSelect,
  selectedTool,
}: {
  onSelect(s: string): void;
  selectedTool: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md bg-white p-2 shadow-[0_1px_15px_rgba(38,38,38,0.25)]">
      {toolboxOptions.map((toolbox) =>
        toolbox.type === "menu" && toolbox.content ? (
          <ToolMenu
            selectedTool={selectedTool}
            onSelect={onSelect}
            toolbox={toolbox}
            key={toolbox.id}
          />
        ) : (
          <Tool
            selectedTool={selectedTool}
            onSelect={onSelect}
            toolbox={toolbox as ToolType}
            key={toolbox.id}
          />
        ),
      )}
    </div>
  );
}

export default Toolbox;

"use client";

import { ToolMenuType } from "@/app/_lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import Tool from "./Tool";

function ToolMenu({
  toolbox,
  onSelect,
  selectedTool,
}: {
  toolbox: ToolMenuType;
  onSelect(s: string): void;
  selectedTool: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={(o) => setOpen(o)}>
      <Tooltip>
        <PopoverTrigger>
          <TooltipTrigger asChild>
            <toolbox.icon
              size={40}
              className={`cursor-pointer rounded-lg p-[6px] hover:bg-neutral-300/50 ${open ? "bg-neutral-300/50" : ""}`}
            />
          </TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent side="right">
          <p>{toolbox.name}</p>
        </TooltipContent>
        <PopoverContent
          className="ml-1 flex w-fit flex-col gap-2 rounded-lg bg-white p-2 shadow-[0_1px_15px_rgba(38,38,38,0.25)]"
          side="right"
        >
          {toolbox.content.map((tb) => (
            <Tool
              selectedTool={selectedTool}
              onSelect={onSelect}
              toolbox={tb}
              key={tb.id}
            />
          ))}
        </PopoverContent>
      </Tooltip>
    </Popover>
  );
}

export default ToolMenu;

"use client";

import { ToolCustomType } from "@/app/_lib/types";
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

function ToolCustom({
  toolbox,
  onSelect,
}: {
  toolbox: ToolCustomType;
  onSelect(s: string): void;
}) {
  const [open, setOpen] = useState(false);
  const Content = toolbox.content as React.ComponentType<{
    onSelect(s: string): void;
  }>;
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
          className="ml-1 w-full rounded-lg bg-white p-2 shadow-[0_1px_15px_rgba(38,38,38,0.25)]"
          side="right"
        >
          <Content onSelect={onSelect} />
        </PopoverContent>
      </Tooltip>
    </Popover>
  );
}

export default ToolCustom;

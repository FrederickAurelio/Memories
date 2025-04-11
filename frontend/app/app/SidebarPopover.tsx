"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { IconType } from "react-icons";

function SidebarPopover({
  children,
  bar,
}: {
  children: React.ReactNode;
  bar: {
    name: string;
    href: string;
    icon: IconType;
    iconFill: IconType;
  };
}) {
  const [open, setOpen] = useState(false);
  const Icon = open ? bar.iconFill : bar.icon;
  return (
    <Popover open={open} onOpenChange={(o) => setOpen(o)}>
      <PopoverTrigger>
        <div className="group flex cursor-pointer flex-col items-center">
          <Icon
            className={`rounded-lg ${open ? "bg-neutral-300/80" : ""} p-[7px] transition-colors duration-150 group-hover:bg-neutral-300/80`}
            size={42}
          />
          <span className="mt-0.5 text-xs font-semibold">{bar.name}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96" side="right">
        {children}
      </PopoverContent>
    </Popover>
  );
}

export default SidebarPopover;

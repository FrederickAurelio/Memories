"use client";
import { useElements } from "@/app/_context/ElementContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRef, useState } from "react";
import { BsTransparency } from "react-icons/bs";

function OpacityToolBar() {
  const opacityChanged = useRef(false);
  const [open, setOpen] = useState(false);
  const { isSelectedId, elements, updateElementState } = useElements();
  const selectedElements = elements.find((el) => el.id === isSelectedId);
  return (
    <>
      {selectedElements && "opacity" in selectedElements && (
        <Popover
          open={open}
          onOpenChange={(o) => {
            if (!o && opacityChanged.current)
              updateElementState(selectedElements);
            setOpen(o);
          }}
        >
          <Tooltip>
            <PopoverTrigger>
              <TooltipTrigger asChild>
                <BsTransparency
                  size={40}
                  className={`rotate-180 cursor-pointer rounded-lg border-2 border-neutral-200 p-[6px] hover:bg-neutral-300/50 ${open ? "bg-neutral-300/50" : ""}`}
                />
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent side="top">
              <p>Transparency</p>
            </TooltipContent>
            <PopoverContent
              className="w-72 rounded-lg bg-white p-2 shadow-[0_1px_15px_rgba(38,38,38,0.25)]"
              side="bottom"
            >
              <h2 className="translate-y-1 text-sm">Transparency</h2>
              <div className="flex items-center justify-center gap-2">
                <Slider
                  onValueChange={(e) => {
                    opacityChanged.current = true;
                    updateElementState(
                      { ...selectedElements, opacity: e[0] / 100 },
                      true,
                    );
                  }}
                  className="bg-neutral-100"
                  value={[Math.round(selectedElements.opacity * 100)]}
                  max={100}
                  step={1}
                />
                <input
                  onChange={(e) => {
                    let value = Number(e.target.value);
                    if (value > 100) value = 100;
                    if (value < 0) value = 0;
                    opacityChanged.current = true;
                    updateElementState(
                      { ...selectedElements, opacity: value / 100 },
                      true,
                    );
                  }}
                  value={Math.round(selectedElements.opacity * 100)}
                  type="text"
                  className="flex h-8 w-10 items-center justify-center rounded-lg border border-neutral-200 text-center text-sm focus:outline-none focus:ring-1 focus:ring-neutral-300 active:outline-none"
                />
              </div>
            </PopoverContent>
          </Tooltip>
        </Popover>
      )}
    </>
  );
}

export default OpacityToolBar;

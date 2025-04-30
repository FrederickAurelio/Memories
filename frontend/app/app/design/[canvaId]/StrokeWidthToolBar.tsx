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
import { Ban, Ellipsis, Minus } from "lucide-react";
import { useRef, useState } from "react";
import { BsBorderWidth } from "react-icons/bs";

function StrokeWidthToolBar() {
  const strokeChanged = useRef(false);
  const [open, setOpen] = useState(false);
  const { isSelectedId, elements, updateElementState } = useElements();
  const selectedElements = elements.find((el) => el.id === isSelectedId);
  return (
    <>
      {selectedElements && "strokeWidth" in selectedElements && (
        <Popover
          open={open}
          onOpenChange={(o) => {
            if (!o && strokeChanged.current)
              updateElementState(selectedElements);
            setOpen(o);
          }}
        >
          <Tooltip>
            <PopoverTrigger>
              <TooltipTrigger asChild>
                <BsBorderWidth
                  size={40}
                  className={`rotate-180 cursor-pointer rounded-lg border-2 border-neutral-200 p-[6px] hover:bg-neutral-300/50 ${open ? "bg-neutral-300/50" : ""}`}
                />
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent side="top">
              <p>Stroke Weight</p>
            </TooltipContent>
            <PopoverContent
              className="w-72 rounded-lg bg-white p-2 shadow-[0_1px_15px_rgba(38,38,38,0.25)]"
              side="bottom"
            >
              <div className="flex gap-2">
                <Ban
                  onClick={() => {
                    strokeChanged.current = true;
                    updateElementState(
                      { ...selectedElements, strokeWidth: 0 },
                      true,
                    );
                  }}
                  className="h-9 w-12 cursor-pointer rounded-lg border border-neutral-200 p-1 text-center text-sm hover:bg-neutral-200/60"
                />
                <Minus
                  onClick={() => {
                    strokeChanged.current = true;
                    updateElementState(
                      {
                        ...selectedElements,
                        strokeWidth: selectedElements.strokeWidth || 2,
                        strokeDash: false,
                      },
                      true,
                    );
                  }}
                  className="h-9 w-12 cursor-pointer rounded-lg border border-neutral-200 text-center text-sm hover:bg-neutral-200/60"
                />
                <Ellipsis
                  onClick={() => {
                    strokeChanged.current = true;
                    updateElementState(
                      {
                        ...selectedElements,
                        strokeWidth: selectedElements.strokeWidth || 2,
                        strokeDash: true,
                      },
                      true,
                    );
                  }}
                  className="h-9 w-12 cursor-pointer rounded-lg border border-neutral-200 p-1 text-center text-sm hover:bg-neutral-200/60"
                />
              </div>
              <h2 className="translate-y-1 text-sm">Stroke Weight</h2>
              <div className="flex items-center justify-center gap-2">
                <Slider
                  onValueChange={(e) => {
                    strokeChanged.current = true;
                    updateElementState(
                      { ...selectedElements, strokeWidth: e[0] },
                      true,
                    );
                  }}
                  className="bg-neutral-100"
                  value={[selectedElements.strokeWidth]}
                  max={100}
                  step={1}
                />
                <input
                  onChange={(e) => {
                    let value = Number(e.target.value);
                    if (value > 100) value = 100;
                    if (value < 0) value = 0;
                    strokeChanged.current = true;
                    updateElementState(
                      { ...selectedElements, strokeWidth: value },
                      true,
                    );
                  }}
                  value={selectedElements.strokeWidth}
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

export default StrokeWidthToolBar;

"use client";

import { useElements } from "@/app/_context/ElementContext";
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
import { useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

function StrokeColorToolBar() {
  const colorChanged = useRef(false);
  const [open, setOpen] = useState(false);
  const { isSelectedId, elements, updateElementState } = useElements();
  const selectedElements = elements.find((el) => el.id === isSelectedId);
  return (
    <>
      {selectedElements && "stroke" in selectedElements && (
        <Popover
          open={open}
          onOpenChange={(o) => {
            if (!o && colorChanged.current)
              updateElementState(selectedElements);
            setOpen(o);
          }}
        >
          <Tooltip>
            <PopoverTrigger>
              <TooltipTrigger asChild>
                <div
                  className={`cursor-pointer rounded-lg border-2 border-neutral-200 p-[5px] hover:bg-neutral-300/50 ${open ? "bg-neutral-300/50" : ""}`}
                >
                  <div
                    style={{ borderColor: selectedElements.stroke }}
                    className={`rounded-full border-4 border-neutral-200 p-[9.5px]`}
                  />
                </div>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent side="top">
              <p>Stroke Color</p>
            </TooltipContent>
            <PopoverContent
              className="w-full rounded-lg bg-white p-2 shadow-[0_1px_15px_rgba(38,38,38,0.25)]"
              side="bottom"
            >
              <HexColorPicker
                color={selectedElements.stroke}
                onChange={(newColor) => {
                  colorChanged.current = true;
                  updateElementState(
                    { ...selectedElements, stroke: newColor },
                    true,
                  );
                }}
              />
              <div className="flex w-full items-center justify-center gap-1 pt-2">
                <h2 className="text-sm">Hex:</h2>
                <input
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value.length > 7) return;
                    if (!value.startsWith("#")) {
                      value = "#" + value;
                    }
                    value = value.replace(/[^0-9a-fA-F#]/g, "");
                    colorChanged.current = true;
                    updateElementState(
                      { ...selectedElements, stroke: value },
                      true,
                    );
                  }}
                  value={selectedElements.stroke}
                  className="w-32 rounded-md border-2 border-neutral-200 px-2 text-neutral-800"
                  type="text"
                />
              </div>
            </PopoverContent>
          </Tooltip>
        </Popover>
      )}
    </>
  );
}

export default StrokeColorToolBar;

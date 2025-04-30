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
import { BringToFrontIcon, ForwardIcon, SendToBack } from "lucide-react";
import { useRef, useState } from "react";

function ArrangeToolBar() {
  const orderChanged = useRef(false);
  const [open, setOpen] = useState(false);
  const { isSelectedId, elements, updateElementState, setElements } =
    useElements();
  const selectedElements = elements.find((el) => el.id === isSelectedId);

  if (!selectedElements) return;

  const selectedElementsIndex = elements.findIndex(
    (el) => el.id === selectedElements.id,
  );
  return (
    <>
      <Popover
        open={open}
        onOpenChange={(o) => {
          if (!o && orderChanged.current) updateElementState(selectedElements);
          setOpen(o);
        }}
      >
        <Tooltip>
          <PopoverTrigger>
            <TooltipTrigger asChild>
              <div
                className={`cursor-pointer rounded-lg border-2 border-neutral-200 p-[6px] font-semibold hover:bg-neutral-300/50 ${open ? "bg-neutral-300/50" : ""}`}
              >
                Arrange
              </div>
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent side="top">
            <p>Arrange</p>
          </TooltipContent>
          <PopoverContent
            className="w-64 rounded-lg bg-white p-2 shadow-[0_1px_15px_rgba(38,38,38,0.25)]"
            side="bottom"
          >
            <div className="flex flex-col gap-2">
              <button
                disabled={selectedElementsIndex === elements.length - 1}
                onClick={() => {
                  orderChanged.current = true;
                  const newEls = elements.filter(
                    (el) => el.id !== selectedElements.id,
                  );
                  setElements([...newEls, selectedElements]);
                }}
                className="flex cursor-pointer items-center rounded-lg border border-neutral-200 p-1 hover:bg-neutral-200/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
              >
                <BringToFrontIcon className="h-9 w-12 p-1 text-center text-sm" />
                <h2>Bring to Front</h2>
              </button>

              <button
                disabled={selectedElementsIndex === elements.length - 1}
                onClick={() => {
                  orderChanged.current = true;
                  const firstEls = elements.slice(0, selectedElementsIndex);
                  const frontEl = elements.slice(
                    selectedElementsIndex + 1,
                    selectedElementsIndex + 2,
                  )[0];
                  const secondEls = elements.slice(
                    selectedElementsIndex + 2,
                    elements.length,
                  );
                  setElements([
                    ...firstEls,
                    frontEl,
                    selectedElements,
                    ...secondEls,
                  ]);
                }}
                className="flex cursor-pointer items-center rounded-lg border border-neutral-200 p-1 hover:bg-neutral-200/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
              >
                <ForwardIcon className="h-9 w-12 p-1 text-center text-sm" />
                <h2>Bring Forward</h2>
              </button>

              <button
                disabled={selectedElementsIndex === 0}
                onClick={() => {
                  orderChanged.current = true;
                  const firstEls = elements.slice(0, selectedElementsIndex - 1);
                  console.log(firstEls);
                  const backEl = elements.slice(
                    selectedElementsIndex - 1,
                    selectedElementsIndex,
                  )[0];
                  const secondEls = elements.slice(
                    selectedElementsIndex + 1,
                    elements.length,
                  );
                  setElements([
                    ...firstEls,
                    selectedElements,
                    backEl,
                    ...secondEls,
                  ]);
                }}
                className="flex cursor-pointer items-center rounded-lg border border-neutral-200 p-1 hover:bg-neutral-200/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
              >
                <ForwardIcon className="h-9 w-12 scale-x-[-1] transform p-1 text-center text-sm" />
                <h2>Send Backward</h2>
              </button>

              <button
                disabled={selectedElementsIndex === 0}
                onClick={() => {
                  orderChanged.current = true;
                  const newEls = elements.filter(
                    (el) => el.id !== selectedElements.id,
                  );
                  setElements([selectedElements, ...newEls]);
                }}
                className="flex cursor-pointer items-center rounded-lg border border-neutral-200 p-1 hover:bg-neutral-200/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
              >
                <SendToBack className="h-9 w-12 p-1 text-center text-sm" />
                <h2>Send to Back</h2>
              </button>
            </div>
          </PopoverContent>
        </Tooltip>
      </Popover>
    </>
  );
}

export default ArrangeToolBar;

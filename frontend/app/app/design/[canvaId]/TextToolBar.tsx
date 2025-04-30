"use client";
import { useElements } from "@/app/_context/ElementContext";
import { defaultFontFamily } from "@/app/_lib/const";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { useRef } from "react";

function TextToolBar() {
  return (
    <>
      <FontFamilyToolBar />
      <FontSizeToolBar />
      <OptToolBar />
      <AlignToolBar />
    </>
  );
}

export default TextToolBar;

function FontSizeToolBar() {
  const textChanged = useRef(false);
  const { isSelectedId, elements, updateElementState } = useElements();
  const selectedElements = elements.find((el) => el.id === isSelectedId);
  return (
    <>
      {selectedElements && selectedElements.type === "text" && (
        <div
          onMouseLeave={() => {
            if (textChanged.current) {
              updateElementState(selectedElements);
              textChanged.current = false;
            }
          }}
          className={`flex h-9 cursor-pointer rounded-lg border-2 border-neutral-200 font-semibold`}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  let value = selectedElements.fontSize - 1;
                  if (value < 0) value = 0;
                  textChanged.current = true;
                  updateElementState(
                    {
                      ...selectedElements,
                      fontSize: value,
                    },
                    true,
                  );
                }}
                className="flex h-full w-6 items-center justify-center hover:bg-neutral-300/50"
              >
                -
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Decrease Font Size</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <input
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.replace(/[^\d]/g, "");
                  if (Number(value) < 0) value = "0";
                  textChanged.current = true;
                  updateElementState(
                    {
                      ...selectedElements,
                      fontSize: Number(value),
                    },
                    true,
                  );
                }}
                value={selectedElements.fontSize}
                type="text"
                className="flex h-full w-8 items-center justify-center text-center hover:bg-neutral-300/50 focus:outline-none"
              />
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Font size</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  const value = selectedElements.fontSize + 1;
                  textChanged.current = true;
                  updateElementState(
                    {
                      ...selectedElements,
                      fontSize: value,
                    },
                    true,
                  );
                }}
                className="flex h-full w-6 items-center justify-center hover:bg-neutral-300/50"
              >
                +
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Increase Font size</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </>
  );
}

function OptToolBar() {
  const { isSelectedId, elements, updateElementState } = useElements();
  const selectedElement = elements.find((el) => el.id === isSelectedId);

  if (!selectedElement || selectedElement.type !== "text") return null;

  const buttons: {
    key: "bold" | "italic" | "underline" | "lineThrough";
    label: string;
    tooltip: string;
    class: string;
  }[] = [
    { key: "bold", label: "B", tooltip: "Bold", class: "font-extrabold" },
    { key: "italic", label: "I", tooltip: "Italic", class: "italic" },
    { key: "underline", label: "U", tooltip: "Underline", class: "underline" },
    {
      key: "lineThrough",
      label: "S",
      tooltip: "Line Through",
      class: "line-through",
    },
  ];

  return (
    <>
      {buttons.map(({ key, label, tooltip, class: styleClass }) => {
        const isActive = selectedElement[key];
        return (
          <div
            key={key}
            className={`flex h-9 cursor-pointer rounded-lg border-2 font-semibold ${
              isActive
                ? "border-neutral-300 bg-neutral-300"
                : "border-neutral-200"
            }`}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    updateElementState({
                      ...selectedElement,
                      [key]: !isActive,
                    })
                  }
                  className={`flex h-full w-8 items-center justify-center hover:bg-neutral-300/50 ${styleClass}`}
                >
                  {label}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      })}
    </>
  );
}

function AlignToolBar() {
  const { isSelectedId, elements, updateElementState } = useElements();
  const selectedElement = elements.find((el) => el.id === isSelectedId);
  const alignOrder = ["left", "justify", "right", "center"] as const;
  const alignIcons = [AlignLeft, AlignJustify, AlignRight, AlignCenter];

  if (!selectedElement || selectedElement.type !== "text") return null;
  const AlignIcon =
    alignIcons[alignOrder.findIndex((a) => a === selectedElement.align)];
  return (
    <div
      className={`"border-neutral-200 flex h-9 cursor-pointer rounded-lg border-2 font-semibold`}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => {
              let indexAlign = alignOrder.findIndex(
                (a) => a === selectedElement.align,
              );
              if (indexAlign >= 3) indexAlign = 0;
              else indexAlign += 1;
              updateElementState({
                ...selectedElement,
                align: alignOrder[indexAlign],
              });
            }}
            className={`flex h-full w-8 items-center justify-center hover:bg-neutral-300/50`}
          >
            <AlignIcon />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">Align</TooltipContent>
      </Tooltip>
    </div>
  );
}

function FontFamilyToolBar() {
  const { isSelectedId, elements, updateElementState } = useElements();
  const selectedElement = elements.find((el) => el.id === isSelectedId);
  if (!selectedElement || selectedElement.type !== "text") return null;

  return (
    <div
      className={`"border-neutral-200 flex h-9 cursor-pointer rounded-lg border-2 font-semibold`}
    >
      <Select
        onValueChange={(e) => {
          updateElementState({ ...selectedElement, fontFamily: e });
        }}
        defaultValue={selectedElement.fontFamily}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Font Family" />
            </SelectTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">Font Family</TooltipContent>
        </Tooltip>
        <SelectContent className="max-h-64 overflow-y-auto">
          <SelectItem
            style={{
              fontFamily: "GeistSans",
            }}
            value="GeistSans"
          >
            Geist Sans
          </SelectItem>
          <SelectItem
            style={{
              fontFamily: "GeistMono",
            }}
            value="GeistMono"
          >
            Geist Mono
          </SelectItem>
          {defaultFontFamily.map((f) => (
            <SelectItem
              style={{
                fontFamily: f,
              }}
              key={f}
              value={f}
            >
              {f}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

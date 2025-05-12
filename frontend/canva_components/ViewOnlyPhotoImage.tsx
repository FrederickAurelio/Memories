"use client";

import { format } from "date-fns";
import { imageMargin, imageMarginBot } from "@/app/_lib/const";
import { PhotoElementType, PhotoMetadata } from "@/app/_lib/types";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { memo, useState } from "react";
import { Group, Image, Rect } from "react-konva";
import { Html } from "react-konva-utils";
import useImage from "use-image";

type Props = {
  photoDescription?: PhotoMetadata;
  element: PhotoElementType;
  isSelectedId: string | null | undefined;
  handleSelectElement: (elementId: string | null) => void;
  mode: "edit" | "view";
};

function PhotoImage({
  photoDescription,
  element,
  isSelectedId,
  handleSelectElement,
  mode,
}: Props) {
  const [isHovering, setIsHovering] = useState(false);
  const [imageDOM] = useImage(
    `${element.src.startsWith("data:image/") ? element.src : `/api/${element.src}`}`,
    "use-credentials",
  );
  return (
    <>
      <Group
        onMouseEnter={
          mode === "edit"
            ? (e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = "pointer";
                setIsHovering(true);
              }
            : undefined
        }
        onMouseLeave={
          mode === "edit"
            ? (e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = "pointer";
                setIsHovering(false);
              }
            : undefined
        }
        id={element.id}
        name="object"
        width={element.width}
        height={element.height}
        x={element.x}
        y={element.y}
        onClick={
          mode === "edit" ? () => handleSelectElement(element.id) : undefined
        }
        onTap={
          mode === "edit" ? () => handleSelectElement(element.id) : undefined
        }
        rotation={element.rotation}
        opacity={element.opacity}
        draggable={false}
      >
        <Rect
          strokeWidth={isSelectedId === element.id || isHovering ? 2 : 0}
          stroke={
            isSelectedId === element.id
              ? "rgba(0, 0, 0, 0.6)"
              : isHovering
                ? "rgba(0, 0, 0, 0.3)"
                : ""
          }
          id={element.id}
          name="object"
          width={element.width}
          height={element.height}
          fill="white"
          shadowBlur={10}
          shadowColor="rgba(0, 0, 0, 0.4)"
          shadowOffsetX={7}
          shadowOffsetY={7}
        />
        <Image
          id={element.id}
          name="object"
          alt="image element"
          x={imageMargin}
          y={imageMargin}
          width={element.width - imageMargin * 2}
          height={element.height - imageMarginBot}
          image={imageDOM}
        />
      </Group>

      {mode === "view" && photoDescription && (
        <Html>
          <div
            style={{
              position: "absolute",
              top: element.y,
              left: element.x,
              pointerEvents: "auto", // important so you can interact
              zIndex: 100,
            }}
          >
            <HoverCard
              open={isHovering}
              onOpenChange={(o) => {
                setIsHovering(o);
              }}
              openDelay={0}
              closeDelay={100}
            >
              <HoverCardTrigger className="z-30">
                <div
                  style={{
                    width: element.width,
                    height: element.height,
                  }}
                ></div>
              </HoverCardTrigger>
              <HoverCardContent
                side="right"
                className="z-30 w-64 rounded-xl p-4 shadow-lg"
              >
                <div className="flex flex-col gap-1">
                  <h1 className="text-base font-semibold text-neutral-800">
                    {photoDescription?.title || "Untitled Photo"}
                  </h1>
                  <p className="text-justify text-sm leading-tight text-neutral-700">
                    {photoDescription?.description ||
                      "No description provided for this photo."}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {photoDescription?.date
                      ? format(photoDescription.date, "PPP")
                      : "Date not specified"}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </Html>
      )}
    </>
  );
}

const areEqual = (prev: Props, next: Props) => {
  return (
    prev.isSelectedId === next.isSelectedId &&
    prev.element.id === next.element.id &&
    prev.element.x === next.element.x &&
    prev.element.y === next.element.y &&
    prev.element.width === next.element.width &&
    prev.element.height === next.element.height &&
    prev.element.rotation === next.element.rotation &&
    prev.element.opacity === next.element.opacity
  );
};

export default memo(PhotoImage, areEqual);

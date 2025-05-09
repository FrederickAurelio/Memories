"use client";

import { imageMargin, imageMarginBot } from "@/app/_lib/const";
import { PhotoElementType } from "@/app/_lib/types";
import { memo, useState } from "react";
import { Group, Image, Rect } from "react-konva";
import useImage from "use-image";

type Props = {
  element: PhotoElementType;
  isSelectedId: string | null;
  handleSelectElement: (elementId: string | null) => void;
  mode: "edit" | "view";
};

function PhotoImage({
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
        onMouseEnter={(e) => {
          const container = e.target.getStage()?.container();
          if (container) container.style.cursor = "pointer";
          setIsHovering(true);
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage()?.container();
          if (container) container.style.cursor = "default";
          setIsHovering(false);
        }}
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

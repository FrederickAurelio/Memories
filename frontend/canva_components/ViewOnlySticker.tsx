"use client";

import { strokeDashGap } from "@/app/_lib/const";
import { StickerElementType } from "@/app/_lib/types";
import { memo } from "react";
import { Image } from "react-konva";
import useImage from "use-image";

type Props = {
  element: StickerElementType;
};

function Sticker({ element }: Props) {
  const [imageDOM] = useImage(
    `${element.src.startsWith("data:image/") ? element.src : `/api/${element.src}`}`,
    "use-credentials",
  );

  return (
    <>
      <Image
        stroke={element.stroke}
        strokeWidth={element.strokeWidth}
        dash={element.strokeDash ? [element.strokeWidth, strokeDashGap] : []}
        id={element.id}
        alt="image element"
        name="object"
        width={element.width}
        height={element.height}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        opacity={element.opacity}
        image={imageDOM}
        draggable={false}
      />
    </>
  );
}

const areEqual = (prev: Props, next: Props) => {
  return (
    prev.element.id === next.element.id &&
    prev.element.src === next.element.src &&
    prev.element.x === next.element.x &&
    prev.element.y === next.element.y &&
    prev.element.width === next.element.width &&
    prev.element.height === next.element.height &&
    prev.element.rotation === next.element.rotation &&
    prev.element.stroke === next.element.stroke &&
    prev.element.strokeWidth === next.element.strokeWidth &&
    prev.element.strokeDash === next.element.strokeDash &&
    prev.element.opacity === next.element.opacity
  );
};

export default memo(Sticker, areEqual);

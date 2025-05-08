"use client";

import { strokeDashGap } from "@/app/_lib/const";
import { DrawElementType } from "@/app/_lib/types";
import { memo } from "react";
import { Line } from "react-konva";

type Props = {
  element: DrawElementType;
};

function Draw({ element }: Props) {
  return (
    <>
      <Line
        dash={
          element.strokeDash ? [element.strokeWidth, strokeDashGap * 2] : []
        }
        id={element.id}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        name="object"
        points={element.points}
        stroke={element.stroke}
        strokeWidth={element.strokeWidth}
        opacity={element.opacity}
        lineCap="round"
        lineJoin="round"
        draggable={false}
      />
    </>
  );
}

const areEqual = (prev: Props, next: Props) => {
  return (
    prev.element.id === next.element.id &&
    prev.element.x === next.element.x &&
    prev.element.y === next.element.y &&
    prev.element.rotation === next.element.rotation &&
    prev.element.stroke === next.element.stroke &&
    prev.element.strokeWidth === next.element.strokeWidth &&
    prev.element.strokeDash === next.element.strokeDash &&
    prev.element.opacity === next.element.opacity &&
    prev.element.points === next.element.points
  );
};

export default memo(Draw, areEqual);

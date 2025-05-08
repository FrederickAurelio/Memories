"use client";

import { strokeDashGap } from "@/app/_lib/const";
import { LineRopeElementType } from "@/app/_lib/types";
import Konva from "konva";
import { memo, useRef } from "react";
import { Group, Line } from "react-konva";

type Props = {
  element: LineRopeElementType;
};

function LineRope({ element }: Props) {
  const shapeRef = useRef<Konva.Group>(null);
  return (
    <Group
      isGroup={true}
      x={element.x}
      y={element.y}
      opacity={element.opacity}
      ref={shapeRef}
      draggable={false}
      id={element.id}
    >
      <Line
        dash={
          element.strokeDash ? [element.strokeWidth, strokeDashGap * 2] : []
        }
        name="object"
        lineCap="round"
        lineJoin="round"
        id={element.id}
        stroke={element.stroke}
        strokeWidth={element.strokeWidth}
        points={[
          element.points[0].x,
          element.points[0].y,
          element.points[1].x,
          element.points[1].y,
        ]}
      />
    </Group>
  );
}

const areEqual = (prev: Props, next: Props) => {
  return (
    prev.element.x === next.element.x &&
    prev.element.y === next.element.y &&
    prev.element.id === next.element.id &&
    prev.element.strokeDash === next.element.strokeDash &&
    prev.element.stroke === next.element.stroke &&
    prev.element.strokeWidth === next.element.strokeWidth &&
    prev.element.opacity === next.element.opacity &&
    prev.element.points === next.element.points
  );
};

export default memo(LineRope, areEqual);

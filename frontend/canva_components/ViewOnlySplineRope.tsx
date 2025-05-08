"use client";

import { strokeDashGap } from "@/app/_lib/const";
import { SplineRopeElementType } from "@/app/_lib/types";
import { memo } from "react";
import { Group, Shape } from "react-konva";

type Props = {
  element: SplineRopeElementType;
};

function SplineRope({ element }: Props) {
  return (
    <Group
      isGroup={true}
      x={element.x}
      y={element.y}
      opacity={element.opacity}
      draggable={false}
      id={element.id}
    >
      <Shape
        name="object"
        lineCap="round"
        lineJoin="round"
        id={element.id}
        stroke={element.stroke}
        strokeWidth={element.strokeWidth}
        sceneFunc={function (context, shape) {
          context.beginPath();
          context.moveTo(element.points[0].x, element.points[0].y);
          context.quadraticCurveTo(
            2 * element.points[1].x -
              0.5 * (element.points[0].x + element.points[2].x),
            2 * element.points[1].y -
              0.5 * (element.points[0].y + element.points[2].y),
            element.points[2].x,
            element.points[2].y,
          );

          // Stroke the curve with black color
          if (element.strokeDash)
            context.setLineDash([element.strokeWidth, strokeDashGap * 2]);
          context.strokeStyle = element.stroke;
          context.lineWidth = element.strokeWidth;
          context.stroke();

          context.fillStrokeShape(shape);
        }}
      />
    </Group>
  );
}

const areEqual = (prev: Props, next: Props) => {
  return (
    prev.element.x === next.element.x &&
    prev.element.y === next.element.y &&
    prev.element.id === next.element.id &&
    prev.element.stroke === next.element.stroke &&
    prev.element.strokeWidth === next.element.strokeWidth &&
    prev.element.strokeDash === next.element.strokeDash &&
    prev.element.opacity === next.element.opacity &&
    prev.element.points === next.element.points
  );
};

export default memo(SplineRope, areEqual);

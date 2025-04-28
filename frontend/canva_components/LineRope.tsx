"use client";

import { useElements } from "@/app/_context/ElementContext";
import { strokeDashGap } from "@/app/_lib/const";
import { LineRopeElementType } from "@/app/_lib/types";
import Konva from "konva";
import { memo, useRef } from "react";
import { Circle, Group, Line } from "react-konva";

type Props = {
  draggable: boolean;
  element: LineRopeElementType;
  isSelected: boolean;
};

function LineRope({ draggable, element, isSelected }: Props) {
  const shapeRef = useRef<Konva.Group>(null);
  const {
    updateElementState,
    removeElement,
    handleSelectElement,
    isOutsideStage,
  } = useElements();
  return (
    <Group
      isGroup={true}
      x={element.x}
      y={element.y}
      ref={shapeRef}
      onClick={() => handleSelectElement(element.id)}
      onTap={() => handleSelectElement(element.id)}
      onDragStart={() => handleSelectElement(element.id)}
      draggable={draggable}
      onDragEnd={(e) => {
        console.log(e.target);
        const { x, y, isGroup } = e.target.attrs;
        if (!shapeRef.current) return;
        if (isOutsideStage(shapeRef.current)) {
          removeElement(element.id);
        } else if (isGroup) {
          updateElementState({
            ...element,
            x,
            y,
          });
        }
      }}
      id={element.id}
    >
      <Line
        dash={element.strokeDash ? [element.strokeWidth, strokeDashGap] : []}
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
      {isSelected &&
        element.points.map((point, i) => {
          return (
            <Circle
              key={(point.x, point.y, i)}
              x={point.x}
              y={point.y}
              draggable
              onDragEnd={() => {
                updateElementState(element);
              }}
              onDragMove={(e) => {
                const { x, y } = e.target.attrs;
                if (!shapeRef.current) return;

                if (!isOutsideStage(shapeRef.current)) {
                  const newEl = element;
                  newEl.points[i].x = x;
                  newEl.points[i].y = y;
                  updateElementState(newEl, true);
                } else {
                  removeElement(element.id);
                }
              }}
              fill="#fafafa"
              stroke="#262626"
              strokeWidth={1}
              radius={8}
            />
          );
        })}
    </Group>
  );
}

const areEqual = (prev: Props, next: Props) => {
  return (
    prev.draggable === next.draggable &&
    prev.isSelected === next.isSelected &&
    prev.element.x === next.element.x &&
    prev.element.y === next.element.y &&
    prev.element.id === next.element.id &&
    prev.element.strokeDash === next.element.strokeDash &&
    prev.element.stroke === next.element.stroke &&
    prev.element.strokeWidth === next.element.strokeWidth &&
    prev.element.points === next.element.points
  );
};

export default memo(LineRope, areEqual);

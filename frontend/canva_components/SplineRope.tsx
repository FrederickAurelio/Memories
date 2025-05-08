"use client";

import { useElements } from "@/app/_context/ElementContext";
import { strokeDashGap } from "@/app/_lib/const";
import { SplineRopeElementType } from "@/app/_lib/types";
import Konva from "konva";
import { memo, useRef } from "react";
import { Circle, Group, Shape } from "react-konva";

type Props = {
  draggable: boolean;
  element: SplineRopeElementType;
  isSelected: boolean;
};

function SplineRope({ draggable, element, isSelected }: Props) {
  const {
    updateElementState,
    removeElement,
    handleSelectElement,
    isOutsideStage,
  } = useElements();
  const shapeRef = useRef<Konva.Group>(null);

  return (
    <Group
      isGroup={true}
      x={element.x}
      y={element.y}
      opacity={element.opacity}
      ref={shapeRef}
      onClick={() => handleSelectElement(element.id)}
      onTap={() => handleSelectElement(element.id)}
      onDragStart={() => handleSelectElement(element.id)}
      draggable={draggable}
      onDragEnd={(e) => {
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
    prev.element.stroke === next.element.stroke &&
    prev.element.strokeWidth === next.element.strokeWidth &&
    prev.element.strokeDash === next.element.strokeDash &&
    prev.element.opacity === next.element.opacity &&
    prev.element.points === next.element.points
  );
};

export default memo(SplineRope, areEqual);

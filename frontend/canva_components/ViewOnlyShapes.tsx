"use client";

import { strokeDashGap } from "@/app/_lib/const";
import { ShapeElementType } from "@/app/_lib/types";
import { memo } from "react";
import { Arrow, Ellipse, Rect, RegularPolygon, Star } from "react-konva";
import Heart from "./Heart";

type Props = {
  element: ShapeElementType;
};

function Shapes({ element }: Props) {
  const commonProps = {
    id: element.id,
    name: "object",
    dash: element.strokeDash ? [element.strokeWidth, strokeDashGap] : undefined,
    strokeWidth: element.strokeWidth,
    opacity: element.opacity,
    stroke: element.stroke || "#262626",
    fill: element.fill || "#262626",
    width: element.width,
    height: element.height,
    x: element.x,
    y: element.y,
    rotation: element.rotation,
    draggable: false,
  };

  return (
    <>
      {element.type === "shape-rect" && <Rect {...commonProps} />}

      {element.type === "shape-circle" && (
        <Ellipse
          {...commonProps}
          radiusX={element.width}
          radiusY={element.height}
        />
      )}

      {(element.type === "shape-hexagon" ||
        element.type === "shape-triangle") && (
        <RegularPolygon
          {...commonProps}
          radius={element.width / 1.8}
          sides={element.sides || 0}
        />
      )}

      {element.type === "shape-star" && (
        <Star
          {...commonProps}
          numPoints={element.numPoints || 0}
          innerRadius={element.width / 3.8}
          outerRadius={element.width / 1.5}
        />
      )}

      {element.type === "shape-arrow" && (
        <Arrow
          {...commonProps}
          points={[0, 0, element.width, 0]}
          pointerLength={element.height / 5}
          pointerWidth={element.height / 5}
        />
      )}

      {element.type === "shape-heart" && <Heart {...commonProps} />}
    </>
  );
}

const areEqual = (prev: Props, next: Props) => {
  return (
    prev.element.id === next.element.id &&
    prev.element.x === next.element.x &&
    prev.element.y === next.element.y &&
    prev.element.width === next.element.width &&
    prev.element.height === next.element.height &&
    prev.element.rotation === next.element.rotation &&
    prev.element.sides === next.element.sides &&
    prev.element.stroke === next.element.stroke &&
    prev.element.fill === next.element.fill &&
    prev.element.strokeWidth === next.element.strokeWidth &&
    prev.element.strokeDash === next.element.strokeDash &&
    prev.element.opacity === next.element.opacity
  );
};

export default memo(Shapes, areEqual);

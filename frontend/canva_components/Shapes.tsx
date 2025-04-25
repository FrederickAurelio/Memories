"use client";

import { useElements } from "@/app/_context/ElementContext";
import { ShapeElementType } from "@/app/_lib/types";
import Konva from "konva";
import { memo, useEffect, useRef } from "react";
import {
  Arrow,
  Ellipse,
  Rect,
  RegularPolygon,
  Star,
  Transformer,
} from "react-konva";
import Heart from "./Heart";

type Props = {
  draggable: boolean;
  element: ShapeElementType;
  isSelected: boolean;
};

function Shapes({ draggable, element, isSelected }: Props) {
  const { handleSelectElement, handleTransformEndElement } = useElements();
  const Shapes =
    element.type === "shape-rect"
      ? Rect
      : element.type === "shape-circle"
        ? Ellipse
        : element.type === "shape-hexagon" || element.type === "shape-triangle"
          ? RegularPolygon
          : element.type === "shape-star"
            ? Star
            : element.type === "shape-arrow"
              ? Arrow
              : Heart;

  const shapeRef = useRef<Konva.Shape>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!transformerRef.current || !shapeRef.current) return;

    if (isSelected) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
    }
  }, [isSelected]);

  return (
    <>
      <Shapes
        id={element.id}
        name="object"
        points={[0, 0, element.width, 0]}
        pointerLength={element.height / 5}
        pointerWidth={element.height / 5}
        strokeWidth={element.strokeWidth || 2}
        stroke={element.stroke || "#262626"}
        fill={element.fill || "#262626"}
        width={element.width || 100}
        height={element.height || 100}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        onClick={() => handleSelectElement(element.id)}
        onTap={() => handleSelectElement(element.id)}
        onDragStart={() => handleSelectElement(element.id)}
        onDragEnd={(e) => handleTransformEndElement(e, element, shapeRef)}
        onTransformEnd={(e) => handleTransformEndElement(e, element, shapeRef)}
        draggable={draggable}
        ref={shapeRef as never}
        radiusX={element.width}
        radiusY={element.height}
        sides={element?.sides || 6}
        radius={element.width / 1.8}
        numPoints={element?.numPoints || 5}
        innerRadius={element.width / 3.8}
        outerRadius={element.width / 1.5}
      />
      <Transformer
        ref={transformerRef}
        flipEnabled={false}
        enabledAnchors={
          element.type === "shape-hexagon" ||
          element.type === "shape-star" ||
          element.type === "shape-triangle"
            ? ["top-left", "top-right", "bottom-left", "bottom-right"]
            : undefined
        }
        boundBoxFunc={(oldBox, newBox) => {
          if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
            return oldBox;
          }
          return newBox;
        }}
      />
    </>
  );
}

const areEqual = (prev: Props, next: Props) => {
  return (
    prev.draggable === next.draggable &&
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
    prev.isSelected === next.isSelected
  );
};

export default memo(Shapes, areEqual);

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
import { strokeDashGap } from "@/app/_lib/const";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";

type Props = {
  draggable: boolean;
  element: ShapeElementType;
  isSelected: boolean;
};

function Shapes({ draggable, element, isSelected }: Props) {
  const { handleSelectElement, handleTransformEndElement } = useElements();
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
    onClick: () => handleSelectElement(element.id),
    onTap: () => handleSelectElement(element.id),
    onDragStart: () => handleSelectElement(element.id),
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) =>
      handleTransformEndElement(e, element, shapeRef),
    onTransformEnd: (e: KonvaEventObject<Event, Node<NodeConfig>>) =>
      handleTransformEndElement(e, element, shapeRef),
    draggable,
    ref: shapeRef as never,
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
    prev.element.strokeDash === next.element.strokeDash &&
    prev.element.opacity === next.element.opacity &&
    prev.isSelected === next.isSelected
  );
};

export default memo(Shapes, areEqual);

"use client";

import { useElements } from "@/app/_context/ElementContext";
import { strokeDashGap } from "@/app/_lib/const";
import { DrawElementType } from "@/app/_lib/types";
import Konva from "konva";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { memo, useEffect, useRef } from "react";
import { Line, Transformer } from "react-konva";

type Props = {
  draggable: boolean;
  element: DrawElementType;
  isSelected: boolean;
};

function Draw({ draggable, element, isSelected }: Props) {
  const {
    updateElementState,
    removeElement,
    handleSelectElement,
    isOutsideStage,
  } = useElements();
  const drawRef = useRef<Konva.Line>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  function handleTransformEndElement(
    e:
      | Konva.KonvaEventObject<DragEvent>
      | KonvaEventObject<Event, Node<NodeConfig>>,
  ) {
    if (!drawRef.current) return;

    const { x, y, rotation, scaleX, scaleY } = e.target.attrs;
    if (!isOutsideStage(drawRef.current)) {
      const scaledPoints = element.points.map((point, index) => {
        return index % 2 === 0 ? point * scaleX : point * scaleY;
      });

      updateElementState({
        ...element,
        x,
        y,
        rotation,
        points: scaledPoints,
      });
      drawRef.current.scaleX(1);
      drawRef.current.scaleY(1);
    } else {
      removeElement(element.id);
    }
  }

  useEffect(() => {
    if (!transformerRef.current || !drawRef.current) return;

    if (isSelected) {
      transformerRef.current.nodes([drawRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
    }
  }, [isSelected]);
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
        lineCap="round"
        lineJoin="round"
        onClick={() => handleSelectElement(element.id)}
        onTap={() => handleSelectElement(element.id)}
        onDragStart={() => handleSelectElement(element.id)}
        draggable={draggable}
        onDragEnd={handleTransformEndElement}
        onTransformEnd={handleTransformEndElement}
        ref={drawRef}
      />
      <Transformer
        ref={transformerRef}
        flipEnabled={false}
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
    prev.element.rotation === next.element.rotation &&
    prev.element.stroke === next.element.stroke &&
    prev.element.strokeWidth === next.element.strokeWidth &&
    prev.element.strokeDash === next.element.strokeDash &&
    prev.isSelected === next.isSelected &&
    prev.element.points === next.element.points
  );
};

export default memo(Draw, areEqual);

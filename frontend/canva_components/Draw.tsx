"use client";

import { DrawElementType, ElementType } from "@/app/_lib/types";
import Konva from "konva";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { useEffect, useRef } from "react";
import { Line, Transformer } from "react-konva";

type Props = {
  element: DrawElementType;
  isSelected: boolean;
  handleSelectElement(elementId: string): void;
  isOutsideStage(node: Konva.Node): boolean;
  updateElementState(updatedEl: ElementType): void;
  removeElement(id: string): void;
};

function Draw({
  element,
  isSelected,
  handleSelectElement,
  isOutsideStage,
  updateElementState,
  removeElement,
}: Props) {
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
        draggable
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

export default Draw;

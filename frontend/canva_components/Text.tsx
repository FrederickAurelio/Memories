"use client";

import { ElementType, TextElementType } from "@/app/_lib/types";
import Konva from "konva";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { memo, RefObject, useEffect, useRef } from "react";
import { Text as KonvaText, Transformer } from "react-konva";

type Props = {
  draggable: boolean;
  element: TextElementType;
  isSelected: boolean;
  handleSelectElement(elementId: string): void;
  handleTransformEnd(
    e:
      | Konva.KonvaEventObject<DragEvent>
      | KonvaEventObject<Event, Node<NodeConfig>>,
    element: ElementType,
    elRef: RefObject<Konva.Text | null>,
  ): void;
};

function Text({
  draggable,
  element,
  isSelected,
  handleSelectElement,
  handleTransformEnd,
}: Props) {
  const textRef = useRef<Konva.Text>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!transformerRef.current || !textRef.current) return;

    if (isSelected) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
    }
  }, [isSelected]);
  return (
    <>
      <KonvaText
        width={element.width}
        id={element.id}
        name="object"
        strokeWidth={element.strokeWidth}
        stroke={element.stroke}
        fill={element.fill}
        x={element.x}
        y={element.y}
        text={element.text}
        fontSize={element.fontSize}
        fontFamily={element.fontFamily}
        rotation={element.rotation}
        onClick={() => handleSelectElement(element.id)}
        onTap={() => handleSelectElement(element.id)}
        onDragStart={() => handleSelectElement(element.id)}
        onDragEnd={(e) => handleTransformEnd(e, element, textRef)}
        onTransform={(e) => handleTransformEnd(e, element, textRef)}
        draggable={draggable}
        ref={textRef}
      />
      <Transformer
        ref={transformerRef}
        flipEnabled={false}
        enabledAnchors={["middle-left", "middle-right"]}
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
    prev.element.text === next.element.text &&
    prev.element.fontSize === next.element.fontSize &&
    prev.element.fontFamily === next.element.fontFamily &&
    prev.element.rotation === next.element.rotation &&
    prev.element.stroke === next.element.stroke &&
    prev.element.strokeWidth === next.element.strokeWidth &&
    prev.element.fill === next.element.fill &&
    prev.isSelected === next.isSelected
  );
};

export default memo(Text, areEqual);

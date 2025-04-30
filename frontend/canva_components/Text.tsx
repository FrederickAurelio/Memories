"use client";
const TextEditor = dynamic(() => import("@/canva_components/TextEditor"), {
  ssr: false,
});

import { useElements } from "@/app/_context/ElementContext";
import { strokeDashGap } from "@/app/_lib/const";
import { TextElementType } from "@/app/_lib/types";
import Konva from "konva";
import dynamic from "next/dynamic";
import { memo, useEffect, useRef, useState } from "react";
import { Text as KonvaText, Transformer } from "react-konva";

type Props = {
  draggable: boolean;
  element: TextElementType;
  isSelected: boolean;
};

function Text({ draggable, element, isSelected }: Props) {
  const textRef = useRef<Konva.Text>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { updateElementState, handleSelectElement, handleTransformEndElement } =
    useElements();
  function handleTextDblClick() {
    if (!draggable) return;
    handleSelectElement(element.id);
    setIsEditing(true);
  }

  function handleTextChange(newText: string) {
    updateElementState({ ...element, text: newText });
    setIsEditing(false);
  }

  useEffect(() => {
    if (!transformerRef.current || !textRef.current) return;

    if (isSelected) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
    }
  }, [isSelected, isEditing]);

  return (
    <>
      <KonvaText
        onDblClick={handleTextDblClick}
        visible={!isEditing}
        opacity={element.opacity}
        width={element.width}
        id={element.id}
        name="object"
        dash={element.strokeDash ? [element.strokeWidth, strokeDashGap] : []}
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
        onDragEnd={(e) => handleTransformEndElement(e, element, textRef)}
        onTransform={(e) => handleTransformEndElement(e, element, textRef)}
        draggable={draggable}
        ref={textRef}
      />
      {isEditing && (
        <TextEditor
          textRef={textRef}
          onChange={handleTextChange}
          onClose={() => setIsEditing(false)}
        />
      )}
      {!isEditing && (
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
      )}
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
    prev.element.strokeDash === next.element.strokeDash &&
    prev.element.opacity === next.element.opacity &&
    prev.element.fill === next.element.fill &&
    prev.isSelected === next.isSelected
  );
};

export default memo(Text, areEqual);

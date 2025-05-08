"use client";
import { strokeDashGap } from "@/app/_lib/const";
import { TextElementType } from "@/app/_lib/types";
import { memo } from "react";
import { Text as KonvaText } from "react-konva";

type Props = {
  element: TextElementType;
};

function Text({ element }: Props) {
  return (
    <>
      <KonvaText
        fontStyle={`${element.bold ? "bold" : ""} 
        ${element.italic ? "italic" : ""}`}
        textDecoration={`${element.underline ? "underline" : ""} 
        ${element.lineThrough ? "line-through" : ""}`}
        align={element.align}
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
        draggable={false}
      />
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
    prev.element.text === next.element.text &&
    prev.element.fontSize === next.element.fontSize &&
    prev.element.fontFamily === next.element.fontFamily &&
    prev.element.rotation === next.element.rotation &&
    prev.element.stroke === next.element.stroke &&
    prev.element.strokeWidth === next.element.strokeWidth &&
    prev.element.strokeDash === next.element.strokeDash &&
    prev.element.opacity === next.element.opacity &&
    prev.element.fill === next.element.fill &&
    prev.element.align === next.element.align &&
    prev.element.bold === next.element.bold &&
    prev.element.italic === next.element.italic &&
    prev.element.underline === next.element.underline &&
    prev.element.lineThrough === next.element.lineThrough
  );
};

export default memo(Text, areEqual);

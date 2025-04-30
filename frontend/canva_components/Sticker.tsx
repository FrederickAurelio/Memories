"use client";

import { useElements } from "@/app/_context/ElementContext";
import { strokeDashGap } from "@/app/_lib/const";
import { StickerElementType } from "@/app/_lib/types";
import Konva from "konva";
import { memo, useEffect, useRef } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";

type Props = {
  draggable: boolean;
  element: StickerElementType;
  isSelected: boolean;
};

function Sticker({ draggable, element, isSelected }: Props) {
  const { handleSelectElement, updateElementState, handleTransformEndElement } =
    useElements();
  const [imageDOM] = useImage(element.src);
  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!imageDOM) return;

    if (element.width === 0 || element.height === 0) {
      updateElementState({
        ...element,
        width: element.width || imageDOM.width,
        height: element.height || imageDOM.height,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageDOM]);

  useEffect(() => {
    if (!transformerRef.current || !imageRef.current) return;

    if (isSelected) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
    }
  }, [isSelected]);
  return (
    <>
      <Image
        stroke={element.stroke}
        strokeWidth={element.strokeWidth}
        dash={element.strokeDash ? [element.strokeWidth, strokeDashGap] : []}
        id={element.id}
        alt="image element"
        name="object"
        width={element.width}
        height={element.height}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        opacity={element.opacity}
        image={imageDOM}
        onClick={() => handleSelectElement(element.id)}
        onTap={() => handleSelectElement(element.id)}
        onDragStart={() => handleSelectElement(element.id)}
        onDragEnd={(e) => handleTransformEndElement(e, element, imageRef)}
        onTransformEnd={(e) => handleTransformEndElement(e, element, imageRef)}
        draggable={draggable}
        ref={imageRef}
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
    prev.element.src === next.element.src &&
    prev.element.x === next.element.x &&
    prev.element.y === next.element.y &&
    prev.element.width === next.element.width &&
    prev.element.height === next.element.height &&
    prev.element.rotation === next.element.rotation &&
    prev.element.stroke === next.element.stroke &&
    prev.element.strokeWidth === next.element.strokeWidth &&
    prev.element.strokeDash === next.element.strokeDash &&
    prev.element.opacity === next.element.opacity &&
    prev.isSelected === next.isSelected
  );
};

export default memo(Sticker, areEqual);

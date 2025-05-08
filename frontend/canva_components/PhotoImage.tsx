"use client";

import { useElements } from "@/app/_context/ElementContext";
import { imageMargin, imageMarginBot } from "@/app/_lib/const";
import { PhotoElementType } from "@/app/_lib/types";
import Konva from "konva";
import { memo, useEffect, useRef } from "react";
import { Group, Image, Rect, Transformer } from "react-konva";
import useImage from "use-image";

type Props = {
  draggable: boolean;
  element: PhotoElementType;
  isSelected: boolean;
  mode?: "view" | "edit";
};

function PhotoImage({ draggable, element, isSelected, mode = "edit" }: Props) {
  const { updateElementState, handleSelectElement, handleTransformEndElement } =
    useElements();

  const [imageDOM] = useImage(
    `${element.src.startsWith("data:image/") ? element.src : `/api/${element.src}`}`,
    "use-credentials",
  );
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!imageDOM) return;

    if (element.width === 0 || element.height === 0) {
      updateElementState({
        ...element,
        width: element.width || imageDOM.width + imageMargin * 2,
        height: element.height || imageDOM.height + imageMarginBot,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageDOM]);

  useEffect(() => {
    if (!transformerRef.current || !groupRef.current) return;

    if (isSelected) {
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
    }
  }, [isSelected]);

  return (
    <>
      <Group
        id={element.id}
        name="object"
        width={element.width}
        height={element.height}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        opacity={element.opacity}
        onClick={
          mode === "edit" ? () => handleSelectElement(element.id) : undefined
        }
        onTap={
          mode === "edit" ? () => handleSelectElement(element.id) : undefined
        }
        onDragStart={
          mode === "edit" ? () => handleSelectElement(element.id) : undefined
        }
        onDragEnd={(e) => handleTransformEndElement(e, element, groupRef)}
        onTransformEnd={(e) => handleTransformEndElement(e, element, groupRef)}
        draggable={draggable}
        ref={groupRef}
      >
        <Rect
          id={element.id}
          name="object"
          width={element.width}
          height={element.height}
          fill="white"
          shadowBlur={10}
          shadowColor="rgba(0, 0, 0, 0.4)"
          shadowOffsetX={7}
          shadowOffsetY={7}
        />
        <Image
          id={element.id}
          name="object"
          alt="image element"
          x={imageMargin}
          y={imageMargin}
          width={element.width - imageMargin * 2}
          height={element.height - imageMarginBot}
          image={imageDOM}
        />
      </Group>
      {mode === "edit" && (
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
    prev.element.rotation === next.element.rotation &&
    prev.element.opacity === next.element.opacity &&
    prev.isSelected === next.isSelected
  );
};

export default memo(PhotoImage, areEqual);

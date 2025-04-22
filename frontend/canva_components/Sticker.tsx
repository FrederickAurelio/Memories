"use client";

import { ElementType, StickerElementType } from "@/app/_lib/types";
import Konva from "konva";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { RefObject, useEffect, useRef } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";

type Props = {
  element: StickerElementType;
  isSelected: boolean;
  handleSelectElement(elementId: string): void;
  updateElementState(updatedEl: ElementType): void;
  handleTransformEnd(
    e:
      | Konva.KonvaEventObject<DragEvent>
      | KonvaEventObject<Event, Node<NodeConfig>>,
    element: ElementType,
    elRef: RefObject<Konva.Image | null>,
  ): void;
};

function Sticker({
  element,
  isSelected,
  handleSelectElement,
  updateElementState,
  handleTransformEnd,
}: Props) {
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
        id={element.id}
        alt="image element"
        name="object"
        width={element.width}
        height={element.height}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        image={imageDOM}
        onClick={() => handleSelectElement(element.id)}
        onTap={() => handleSelectElement(element.id)}
        onDragStart={() => handleSelectElement(element.id)}
        onDragEnd={(e) => handleTransformEnd(e, element, imageRef)}
        onTransformEnd={(e) => handleTransformEnd(e, element, imageRef)}
        draggable
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

export default Sticker;

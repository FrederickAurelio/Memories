import { imageMargin, imageMarginBot } from "@/app/_lib/const";
import { ElementType, PhotoElementType } from "@/app/_lib/types";
import { Dispatch, memo, SetStateAction, useEffect, useRef } from "react";
import { Group, Image, Rect, Transformer } from "react-konva";
import Konva from "konva";
import useImage from "use-image";

type Props = {
  element: PhotoElementType;
  isSelected: boolean;
  setIsSelected: Dispatch<SetStateAction<string | null>>;
  updateElementState(updatedEl: ElementType): void;
  stageSize: { width: number; height: number };
  removeElement(id: string): void;
};

function PhotoImage({
  element,
  isSelected,
  setIsSelected,
  updateElementState,
  stageSize,
  removeElement,
}: Props) {
  const [imageDOM] = useImage(element.src);
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  function handleClick() {
    setIsSelected(element.id);
  }

  function handleTransformEnd(e: Konva.KonvaEventObject<DragEvent>) {
    const { x, y, rotation, scaleX, scaleY } = e.target.attrs;

    if (
      x + element.width > 0 &&
      x < stageSize.width &&
      y + element.height > 0 &&
      y < stageSize.height
    ) {
      updateElementState({
        ...element,
        x,
        y,
        rotation,
        width: Math.max(5, element.width * scaleX),
        height: Math.max(element.height * scaleY),
      });

      if (groupRef.current) {
        groupRef.current.scaleX(1);
        groupRef.current.scaleY(1);
      }
    } else {
      removeElement(element.id);
    }
  }

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

  console.log(element.id);
  return (
    <>
      <Group
        width={element.width}
        height={element.height}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        onClick={handleClick}
        onTap={handleClick}
        onDragStart={handleClick}
        onDragEnd={handleTransformEnd}
        onTransformEnd={handleTransformEnd}
        draggable
        ref={groupRef}
      >
        <Rect
          width={element.width}
          height={element.height}
          fill="white"
          shadowBlur={10}
          shadowColor="rgba(0, 0, 0, 0.3)"
          shadowOffsetX={7}
          shadowOffsetY={7}
        />
        <Image
          alt="image element"
          x={imageMargin}
          y={imageMargin}
          width={element.width - imageMargin * 2}
          height={element.height - imageMarginBot}
          image={imageDOM}
        />
      </Group>
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
    prev.element.id === next.element.id &&
    prev.element.x === next.element.x &&
    prev.element.y === next.element.y &&
    prev.element.width === next.element.width &&
    prev.element.height === next.element.height &&
    prev.element.rotation === next.element.rotation &&
    prev.isSelected === next.isSelected
  );
};

export default memo(PhotoImage, areEqual);

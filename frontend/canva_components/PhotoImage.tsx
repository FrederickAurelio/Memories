import { imageMargin, imageMarginBot } from "@/app/_lib/const";
import { ElementType, PhotoElementType } from "@/app/_lib/types";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef } from "react";
import { Group, Image, Rect, Transformer } from "react-konva";

import useImage from "use-image";

function PhotoImage({
  element,
  updateElementState,
}: {
  element: PhotoElementType;
  updateElementState(updatedEl: ElementType): void;
}) {
  const [imageDOM] = useImage(element.src);
  const groupRef = useRef(null);
  const transformerRef = useRef(null);

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const { x, y, rotation, width, height } = e.target.attrs;
    updateElementState({
      ...element,
      x,
      y,
      rotation,
      width,
      height,
    });
  };

  useEffect(() => {
    if (element.width === 0 || element.height === 0)
      updateElementState({
        ...element,
        width: element.width || imageDOM?.width || 0,
        height: element.height || imageDOM?.height || 0,
      });
  }, [imageDOM]);

  return (
    <>
      <Group
        onDragMove={handleDragMove}
        width={element ? element.width + imageMargin * 2 : 0}
        height={element ? element.height + imageMarginBot : 0} // Larger bottom border
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        onClick={handleClick}
        onTap={handleClick}
        onDragStart={handleClick}
        ref={groupRef}
        draggable
        onDragEnd={handleTransformEnd}
        onTransformEnd={handleTransformEnd}
        // onDragMove={handleDrag}
      >
        {/* Polaroid-style border */}
        <Rect
          width={element ? element.width + imageMargin * 2 : 0}
          height={element ? element.height + imageMarginBot : 0} // Larger bottom border
          fill="white"
          shadowBlur={10}
          shadowColor="rgba(0, 0, 0, 0.3)"
          shadowOffsetX={7}
          shadowOffsetY={7}
        />
        {/* Image positioned within the border */}
        <Image
          alt="image element"
          x={imageMargin} // Centered horizontally within the border
          y={imageMargin} // Spaced from top of border
          width={element.width}
          height={element.height}
          image={imageDOM}
        />
      </Group>
      <Transformer
        ref={transformerRef}
        flipEnabled={false}
        boundBoxFunc={(oldBox, newBox) => {
          // limit resize
          if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
            return oldBox;
          }
          return newBox;
        }}
      />
    </>
  );
}

export default PhotoImage;

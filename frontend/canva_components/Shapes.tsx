import { elRefType, ShapeElementType } from "@/app/_lib/types";
import Konva from "konva";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { RefObject, useEffect, useRef } from "react";
import { Circle, Rect, RegularPolygon, Star, Transformer } from "react-konva";

type Props = {
  element: ShapeElementType;
  isSelected: boolean;
  handleSelectElement(elementId: string): void;
  // updateElementState(updatedEl: ShapeElementType): void;
  handleTransformEnd(
    e:
      | Konva.KonvaEventObject<DragEvent>
      | KonvaEventObject<Event, Node<NodeConfig>>,
    element: ShapeElementType,
    elRef: RefObject<Konva.Shape | null>,
  ): void;
};

function Shapes({
  element,
  isSelected,
  handleSelectElement,
  // updateElementState,
  handleTransformEnd,
}: Props) {
  const Shapes =
    element.type === "shape-rect"
      ? Rect
      : element.type === "shape-circle"
        ? Circle
        : element.type === "shape-hexagon" || element.type === "shape-triangle"
          ? RegularPolygon
          : element.type === "shape-star"
            ? Star
            : Rect;

  const shapeRef = useRef<Konva.Shape>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!transformerRef.current || !shapeRef.current) return;

    if (isSelected) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
    }
  }, [isSelected]);

  return (
    <>
      <Shapes
        name="object"
        strokeWidth={element.strokeWidth || 2}
        stroke={element.stroke || "#262626"}
        fill={element.fill || "#262626"}
        width={element.width || 100}
        height={element.height || 100}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        onClick={() => handleSelectElement(element.id)}
        onTap={() => handleSelectElement(element.id)}
        onDragStart={() => handleSelectElement(element.id)}
        onDragEnd={(e) => handleTransformEnd(e, element, shapeRef)}
        onTransformEnd={(e) => handleTransformEnd(e, element, shapeRef)}
        draggable
        ref={shapeRef as elRefType}
        sides={element?.sides || 6}
        radius={element?.radius || 70}
        numPoints={element?.numPoints || 5}
        innerRadius={element?.innerRadius || 30}
        outerRadius={element?.outerRadius || 70}
      ></Shapes>
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

export default Shapes;

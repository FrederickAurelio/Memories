import { elRefType, ShapeElementType } from "@/app/_lib/types";
import Konva from "konva";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { RefObject, useEffect, useRef } from "react";
import {
  Arrow,
  Ellipse,
  Rect,
  RegularPolygon,
  Star,
  Transformer,
} from "react-konva";
import Heart from "./Heart";

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
        ? Ellipse
        : element.type === "shape-hexagon" || element.type === "shape-triangle"
          ? RegularPolygon
          : element.type === "shape-star"
            ? Star
            : element.type === "shape-arrow"
              ? Arrow
              : Heart;

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
        points={[0, 0, element.width, 0]}
        pointerLength={element.height / 5}
        pointerWidth={element.height / 5}
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
        radiusX={element.width / 2}
        radiusY={element.height / 2}
        sides={element?.sides || 6}
        radius={element.width / 1.8}
        numPoints={element?.numPoints || 5}
        innerRadius={element.width / 3.8}
        outerRadius={element.width / 1.5}
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

export default Shapes;

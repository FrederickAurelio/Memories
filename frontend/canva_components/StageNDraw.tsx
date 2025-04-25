"use client";

import { useElements } from "@/app/_context/ElementContext";
import Konva from "konva";
import { Dispatch, RefObject, SetStateAction, useEffect } from "react";
import { Stage } from "react-konva";

type Props = {
  children: React.ReactNode;
  stageSize: {
    width: number;
    height: number;
  };
  stageRef: RefObject<Konva.Stage | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  setStageSize: Dispatch<
    SetStateAction<{
      width: number;
      height: number;
    }>
  >;
};

function StageNDraw({
  children,
  stageSize,
  stageRef,
  containerRef,
  setStageSize,
}: Props) {
  const {
    elements,
    selectedTool,
    isDrawing,
    handleSelectElement,
    updateStack,
    setElements,
    removeElement,
  } = useElements();
  function handleMouseDown(
    e: Konva.KonvaEventObject<TouchEvent> | Konva.KonvaEventObject<MouseEvent>,
  ) {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) handleSelectElement(null);

    if (selectedTool.startsWith("draw-pen")) {
      isDrawing.current = "drawing";
      const pos = e.target.getStage()?.getPointerPosition();
      setElements((els) => [
        ...els,
        {
          type: "draw",
          id: new Date().toISOString(),
          points: [pos?.x as number, pos?.y as number],
          x: 0,
          y: 0,
          rotation: 0,
          stroke: "#262626",
          strokeWidth: 3,
        },
      ]);
    } else if (selectedTool.startsWith("draw-eraser")) {
      isDrawing.current = "erasing";
    }
  }

  function handleMouseMove(
    e: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>,
  ) {
    if (isDrawing.current === "drawing") {
      const stage = e.target.getStage();
      if (!stage) return;
      const point = stage.getPointerPosition();
      try {
        setElements((e) => {
          return e.map((el, i) =>
            e.length - 1 === i && el.type === "draw"
              ? {
                  ...el,
                  points: el.points.concat([
                    point?.x as number,
                    point?.y as number,
                  ]),
                }
              : el,
          );
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {}
    } else if (isDrawing.current === "erasing") {
      const isObject = e.target.attrs.name === "object";
      if (isObject) removeElement(e.target.attrs.id);
    }
  }

  function handleMouseUp() {
    if (isDrawing.current !== "none") {
      isDrawing.current = "none";
      updateStack(elements);
    }
  }

  // Update size of canvas
  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setStageSize({ width: clientWidth, height: clientHeight });
      }
    }

    updateSize();
    window.addEventListener("resize", updateSize);
  }, [containerRef, setStageSize]);

  return (
    <Stage
      style={{
        cursor: `${selectedTool.startsWith("draw") ? "crosshair" : "default"}`,
      }}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      width={stageSize.width}
      height={stageSize.height}
      ref={stageRef}
    >
      {children}
    </Stage>
  );
}

export default StageNDraw;

"use client";
const InputImageCanva = dynamic(
  () => import("@/canva_components/InputImageCanva"),
  {
    ssr: false,
  },
);
const LayerGuideline = dynamic(
  () => import("@/canva_components/LayerGuideline"),
  {
    ssr: false,
  },
);
const StageNDraw = dynamic(() => import("@/canva_components/StageNDraw"), {
  ssr: false,
});
const PhotoImage = dynamic(() => import("@/canva_components/PhotoImage"), {
  ssr: false,
});
const Shapes = dynamic(() => import("@/canva_components/Shapes"), {
  ssr: false,
});
const Sticker = dynamic(() => import("@/canva_components/Sticker"), {
  ssr: false,
});
const Draw = dynamic(() => import("@/canva_components/Draw"), {
  ssr: false,
});
const SplineRope = dynamic(() => import("@/canva_components/SplineRope"), {
  ssr: false,
});
const LineRope = dynamic(() => import("@/canva_components/LineRope"), {
  ssr: false,
});
const Text = dynamic(() => import("@/canva_components/Text"), {
  ssr: false,
});
import {
  DrawElementType,
  ElementType,
  LineRopeElementType,
  PhotoElementType,
  ShapeElementType,
  SplineRopeElementType,
  StickerElementType,
  TextElementType,
} from "@/app/_lib/types";
import { GeistSans } from "geist/font/sans";
import Konva from "konva";
import dynamic from "next/dynamic";
import { memo, useEffect, useRef, useState } from "react";
import { useElements } from "@/app/_context/ElementContext";

const Canva = memo(function Canva() {
  const {
    isSelectedId,
    elements,
    selectedTool,
    isDrawing,
    handleSelectElement,
    addElement,
    handleSelectTool,
    zoomIn,
    zoomOut,
    setCurStateStack,
  } = useElements();

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [inputImageType, setInputImageType] = useState<"photo" | "sticker">(
    "photo",
  );

  // Handle INPUT from Toolbox
  useEffect(() => {
    if (selectedTool === "photo" || selectedTool === "sticker") {
      if (inputRef.current) inputRef.current.click();
      setInputImageType(selectedTool);
    } else if (selectedTool.startsWith("shape")) {
      addElement({
        type: selectedTool as ShapeElementType["type"],
        id: new Date().toISOString(),
        x: stageSize.width / 2,
        y: stageSize.height / 2,
        rotation: 0,
        width: selectedTool === "shape-circle" ? 50 : 100,
        height: selectedTool === "shape-circle" ? 50 : 100,
        sides: selectedTool === "shape-triangle" ? 3 : 6,
        stroke: "#262626",
        fill: "#ffff",
        strokeWidth: 2,
      });
    } else if (selectedTool.startsWith("draw")) {
      handleSelectElement(null);
      return;
    } else if (selectedTool.startsWith("rope")) {
      const type = selectedTool as "rope-line" | "rope-spline";
      const points =
        type === "rope-line"
          ? [
              { x: -100, y: 0 },
              { x: 100, y: 0 },
            ]
          : [
              { x: -100, y: 0 },
              { x: 0, y: 0 },
              { x: 100, y: 0 },
            ];
      addElement({
        type: type,
        id: new Date().toISOString(),
        stroke: "#262626",
        strokeWidth: 2,
        x: stageSize.width / 2,
        y: stageSize.height / 2,
        points: points,
      } as ElementType);
    } else if (selectedTool.startsWith("text")) {
      addElement({
        type: "text",
        id: new Date().toISOString(),
        stroke: "#262626",
        rotation: 0,
        strokeWidth: 0,
        width: 150,
        height: 30,
        fill: "#262626",
        text: "Simple Text",
        fontSize: 30,
        fontFamily: GeistSans.className,
        x: stageSize.width / 2,
        y: stageSize.height / 2,
      });
    } else if (selectedTool.startsWith("zoom-in")) {
      zoomIn();
    } else if (selectedTool.startsWith("zoom-out")) {
      zoomOut();
    } else if (selectedTool.startsWith("redo")) {
      setCurStateStack((s) => s - 1);
    } else if (selectedTool.startsWith("undo")) {
      setCurStateStack((s) => s + 1);
    }
    handleSelectTool("select");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTool]);

  return (
    <div ref={containerRef} className="flex h-full w-full">
      <InputImageCanva
        stageSize={stageSize}
        inputImageType={inputImageType}
        inputRef={inputRef}
      />
      <StageNDraw
        containerRef={containerRef}
        setStageSize={setStageSize}
        stageRef={stageRef}
        stageSize={stageSize}
      >
        <LayerGuideline stageRef={stageRef}>
          {elements.map((e) => {
            if (e.type === "photo")
              return (
                <PhotoImage
                  draggable={
                    !selectedTool.startsWith("draw") &&
                    isDrawing.current === "none"
                  }
                  isSelected={isSelectedId === e.id}
                  key={e.id}
                  element={e as PhotoElementType}
                />
              );
            else if (e.type.startsWith("shape"))
              return (
                <Shapes
                  draggable={
                    !selectedTool.startsWith("draw") &&
                    isDrawing.current === "none"
                  }
                  isSelected={isSelectedId === e.id}
                  key={e.id}
                  element={e as ShapeElementType}
                />
              );
            else if (e.type.startsWith("sticker"))
              return (
                <Sticker
                  draggable={
                    !selectedTool.startsWith("draw") &&
                    isDrawing.current === "none"
                  }
                  isSelected={isSelectedId === e.id}
                  key={e.id}
                  element={e as StickerElementType}
                />
              );
            else if (e.type.startsWith("draw"))
              return (
                <Draw
                  draggable={
                    !selectedTool.startsWith("draw") &&
                    isDrawing.current === "none"
                  }
                  isSelected={isSelectedId === e.id}
                  key={e.id}
                  element={e as DrawElementType}
                />
              );
            else if (e.type.startsWith("rope-spline"))
              return (
                <SplineRope
                  draggable={
                    !selectedTool.startsWith("draw") &&
                    isDrawing.current === "none"
                  }
                  isSelected={isSelectedId === e.id}
                  key={e.id}
                  element={e as SplineRopeElementType}
                />
              );
            else if (e.type.startsWith("rope-line"))
              return (
                <LineRope
                  draggable={
                    !selectedTool.startsWith("draw") &&
                    isDrawing.current === "none"
                  }
                  isSelected={isSelectedId === e.id}
                  key={e.id}
                  element={e as LineRopeElementType}
                />
              );
            else if (e.type.startsWith("text"))
              return (
                <Text
                  draggable={
                    !selectedTool.startsWith("draw") &&
                    isDrawing.current === "none"
                  }
                  isSelected={isSelectedId === e.id}
                  key={e.id}
                  element={e as TextElementType}
                />
              );
          })}
        </LayerGuideline>
      </StageNDraw>
    </div>
  );
});

export default Canva;

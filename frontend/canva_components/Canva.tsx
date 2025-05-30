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

import { v4 as uuidv4 } from "uuid";
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
import Konva from "konva";
import dynamic from "next/dynamic";
import { memo, useEffect, useRef, useState } from "react";
import { useElements } from "@/app/_context/ElementContext";
import { GeistMono } from "geist/font/mono";

const Canva = memo(function Canva() {
  const {
    isSelectedId,
    elements,
    selectedTool,
    isDrawing,
    copiedElement,
    curStateStack,
    stateStack,
    handleSelectElement,
    addElement,
    handleSelectTool,
    zoomIn,
    zoomOut,
    setCurStateStack,
    setCopiedElement,
    removeElement,
  } = useElements();

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [inputImageType, setInputImageType] = useState<"photo" | "sticker">(
    "photo",
  );

  function detectKeydown(event: KeyboardEvent) {
    if (event.ctrlKey && (event.key === "c" || event.key === "C")) {
      const selectedElements = elements.find((el) => el.id === isSelectedId);
      if (selectedElements) setCopiedElement(selectedElements);
    }
    if (event.ctrlKey && (event.key === "v" || event.key === "V")) {
      if (copiedElement) {
        const newEl = {
          ...copiedElement,
          id: uuidv4(),
          x: copiedElement.x + 10,
          y: copiedElement.y + 10,
        };
        setCopiedElement(newEl);
        addElement(newEl);
      }
    }
    if (event.key === "Delete") {
      if (isSelectedId) removeElement(isSelectedId);
    }

    if (
      event.ctrlKey &&
      event.shiftKey &&
      (event.key === "z" || event.key === "Z")
    ) {
      if (!(curStateStack <= 0)) setCurStateStack((s) => s - 1);
    } else if (event.ctrlKey && (event.key === "z" || event.key === "Z")) {
      if (!(curStateStack >= stateStack.length - 1))
        setCurStateStack((s) => s + 1);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", detectKeydown);

    return () => document.removeEventListener("keydown", detectKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelectedId, elements]);

  // Handle INPUT from Toolbox
  useEffect(() => {
    if (selectedTool === "photo" || selectedTool === "sticker") {
      if (inputRef.current) inputRef.current.click();
      setInputImageType(selectedTool);
    } else if (selectedTool.startsWith("shape")) {
      addElement({
        type: selectedTool as ShapeElementType["type"],
        id: uuidv4(),
        x: stageSize.width / 2,
        y: stageSize.height / 2,
        rotation: 0,
        width: selectedTool === "shape-circle" ? 50 : 100,
        height: selectedTool === "shape-circle" ? 50 : 100,
        sides: selectedTool === "shape-triangle" ? 3 : 6,
        stroke: "#262626",
        fill: "#ffff",
        strokeWidth: 2,
        numPoints: selectedTool === "shape-star" ? 5 : 0,
        strokeDash: false,
        opacity: 1,
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
        id: uuidv4(),
        stroke: "#262626",
        strokeWidth: 2,
        strokeDash: false,
        x: stageSize.width / 2,
        y: stageSize.height / 2,
        points: points,
        opacity: 1,
      } as ElementType);
    } else if (selectedTool.startsWith("text")) {
      addElement({
        type: "text",
        id: uuidv4(),
        stroke: "#262626",
        rotation: 0,
        strokeWidth: 0,
        width: 150,
        height: 30,
        fill: "#262626",
        strokeDash: false,
        text: "Simple Text",
        fontSize: 30,
        fontFamily: GeistMono.style.fontFamily
          ? GeistMono.style.fontFamily.split(",")[0].replaceAll("'", "")
          : "",
        x: stageSize.width / 2,
        y: stageSize.height / 2,
        opacity: 1,
        align: "left",
        bold: false,
        italic: false,
        lineThrough: false,
        underline: false,
      });
    } else if (selectedTool.startsWith("zoom-in")) {
      zoomIn();
    } else if (selectedTool.startsWith("zoom-out")) {
      zoomOut();
    } else if (selectedTool.startsWith("redo")) {
      if (!(curStateStack <= 0)) setCurStateStack((s) => s - 1);
    } else if (selectedTool.startsWith("undo")) {
      if (!(curStateStack >= stateStack.length - 1))
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

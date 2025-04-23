"use client";
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
  elRefType,
  LineRopeElementType,
  PhotoElementType,
  ShapeElementType,
  SplineRopeElementType,
  StickerElementType,
  TextElementType,
} from "@/app/_lib/types";
import { useLocalStorage } from "@uidotdev/usehooks";
import Konva from "konva";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node.js";
import dynamic from "next/dynamic";
import { memo, useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import {
  drawGuides,
  getGuides,
  getLineGuideStops,
  getObjectSnappingEdges,
} from "./guideline.js";
import imageCompression from "browser-image-compression";
import { GeistSans } from "geist/font/sans";

const Canva = memo(function Canva({
  selectedTool,
  handleSelectTool,
}: {
  selectedTool: string;
  handleSelectTool(s: string): void;
}) {
  const isDrawing = useRef<"none" | "drawing" | "erasing">("none");
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [elements, setElements] = useLocalStorage<ElementType[]>(
    "elements",
    [],
  );
  const [isSelected, setIsSelected] = useState<string | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const [inputImageType, setInputImageType] = useState<"photo" | "sticker">(
    "photo",
  );

  function updateElementState(updatedEl: ElementType) {
    setElements((elements) =>
      elements.map((element) =>
        element.id === updatedEl.id ? updatedEl : element,
      ),
    );
  }

  function handleSelectElement(elementId: string) {
    if (!selectedTool.startsWith("draw") && isDrawing.current === "none")
      setIsSelected(elementId);
  }

  function removeElement(id: string) {
    setElements((elements) => elements.filter((el) => el.id !== id));
  }

  function addElement(el: ElementType) {
    setElements((els) => {
      return [...els, el];
    });
  }

  function isOutsideStage(node: Konva.Node) {
    const stage = node.getStage();
    if (!stage) return false;
    const nodeBox = node.getClientRect({ relativeTo: stage });
    return (
      nodeBox.x + nodeBox.width < 0 ||
      nodeBox.y + nodeBox.height < 0 ||
      nodeBox.x > stageSize.width ||
      nodeBox.y > stageSize.height
    );
  }

  function handleTransformEndElement(
    e:
      | Konva.KonvaEventObject<DragEvent>
      | KonvaEventObject<Event, Node<NodeConfig>>,
    element:
      | PhotoElementType
      | ShapeElementType
      | StickerElementType
      | TextElementType,
    elRef: elRefType,
  ) {
    if (!elRef.current) return;

    const { x, y, rotation, scaleX, scaleY } = e.target.attrs;
    if (!isOutsideStage(elRef.current)) {
      const newWidth = Math.max(5, element.width * scaleX);
      const newHeight = Math.max(element.height * scaleY);
      updateElementState({
        ...element,
        x,
        y,
        rotation,
        width: newWidth,
        height: newHeight,
      });
      elRef.current.scaleX(1);
      elRef.current.scaleY(1);
    } else {
      removeElement(element.id);
    }
  }

  function handleMouseDown(
    e: Konva.KonvaEventObject<TouchEvent> | Konva.KonvaEventObject<MouseEvent>,
  ) {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) setIsSelected(null);

    if (selectedTool.startsWith("draw-pen")) {
      isDrawing.current = "drawing";
      const pos = e.target.getStage()?.getPointerPosition();
      addElement({
        type: "draw",
        id: new Date().toISOString(),
        points: [pos?.x as number, pos?.y as number],
        x: 0,
        y: 0,
        rotation: 0,
        stroke: "#262626",
        strokeWidth: 3,
      });
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
    } else if (isDrawing.current === "erasing") {
      const isObject = e.target.attrs.name === "object";
      if (isObject) removeElement(e.target.attrs.id);
    }
  }

  function handleMouseUp() {
    isDrawing.current = "none";
  }

  // Handle INPUT Photo
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 768,
    });
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      addElement({
        type: inputImageType as "photo" | "sticker",
        id: new Date().toISOString(),
        x: stageSize.width / 2,
        y: stageSize.height / 2,
        src: base64,
        rotation: 0,
        width: 0,
        height: 0,
        stroke: "#262626",
        strokeWidth: 0,
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };
    reader.readAsDataURL(compressedFile);
  }

  // Handle INPUT from Toolbox
  useEffect(() => {
    if (selectedTool === "photo" || selectedTool === "sticker") {
      if (inputRef.current) inputRef.current.click();
      setInputImageType(selectedTool);
      handleSelectTool("select");
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
      handleSelectTool("select");
      handleSelectElement(new Date().toISOString());
    } else if (selectedTool.startsWith("draw")) {
      setIsSelected(null);
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
      handleSelectTool("select");
      handleSelectElement(new Date().toISOString());
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
      handleSelectTool("select");
      handleSelectElement(new Date().toISOString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTool]);

  // Update size of canvas
  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setStageSize({ width: offsetWidth, height: offsetHeight });
      }
    }

    updateSize();
    window.addEventListener("resize", updateSize);
  }, []);

  return (
    <div ref={containerRef} className="flex h-full w-full bg-red-100">
      <input
        ref={inputRef}
        onChange={handleFileChange}
        type="file"
        accept="image/*"
        className="hidden"
      />
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
        <Layer
          ref={layerRef}
          onDragEnd={() => {
            if (!layerRef.current) return;
            layerRef.current.find(".guid-line").forEach((l) => l.destroy());
          }}
          onDragMove={(e) => {
            if (!layerRef.current) return;
            // clear all previous lines on the screen
            layerRef.current.find(".guid-line").forEach((l) => l.destroy());

            // find possible snapping lines
            const lineGuideStops = getLineGuideStops(
              e.target,
              stageRef.current,
            );
            // find snapping points of current object
            const itemBounds = getObjectSnappingEdges(e.target);

            // now find where can we snap current object
            const guides = getGuides(lineGuideStops, itemBounds);

            // do nothing of no snapping
            if (!guides.length) {
              return;
            }

            drawGuides(guides, layerRef.current);

            const absPos = e.target.absolutePosition();
            // now force object position
            guides.forEach((lg) => {
              switch (lg.orientation) {
                case "V": {
                  absPos.x = lg.lineGuide + lg.offset;
                  break;
                }
                case "H": {
                  absPos.y = lg.lineGuide + lg.offset;
                  break;
                }
              }
            });
            e.target.absolutePosition(absPos);
          }}
        >
          {elements.map((e) => {
            if (e.type === "photo")
              return (
                <PhotoImage
                  draggable={
                    !selectedTool.startsWith("draw") &&
                    isDrawing.current === "none"
                  }
                  isSelected={isSelected === e.id}
                  handleSelectElement={handleSelectElement}
                  updateElementState={updateElementState}
                  handleTransformEnd={handleTransformEndElement}
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
                  handleSelectElement={handleSelectElement}
                  isSelected={isSelected === e.id}
                  handleTransformEnd={handleTransformEndElement}
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
                  isSelected={isSelected === e.id}
                  handleSelectElement={handleSelectElement}
                  updateElementState={updateElementState}
                  handleTransformEnd={handleTransformEndElement}
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
                  isOutsideStage={isOutsideStage}
                  updateElementState={updateElementState}
                  removeElement={removeElement}
                  isSelected={isSelected === e.id}
                  handleSelectElement={handleSelectElement}
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
                  isOutsideStage={isOutsideStage}
                  updateElementState={updateElementState}
                  removeElement={removeElement}
                  isSelected={isSelected === e.id}
                  handleSelectElement={handleSelectElement}
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
                  isOutsideStage={isOutsideStage}
                  updateElementState={updateElementState}
                  removeElement={removeElement}
                  isSelected={isSelected === e.id}
                  handleSelectElement={handleSelectElement}
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
                  handleTransformEnd={handleTransformEndElement}
                  isSelected={isSelected === e.id}
                  handleSelectElement={handleSelectElement}
                  key={e.id}
                  element={e as TextElementType}
                />
              );
          })}
        </Layer>
      </Stage>
    </div>
  );
});

export default Canva;

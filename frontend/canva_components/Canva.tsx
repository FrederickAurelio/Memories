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
import {
  ElementType,
  elRefType,
  PhotoElementType,
  ShapeElementType,
  StickerElementType,
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

const Canva = memo(function Canva({
  selectedTool,
  handleSelectTool,
}: {
  selectedTool: string;
  handleSelectTool(s: string): void;
}) {
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
    element: ElementType,
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

  function handleClickStage(
    e: Konva.KonvaEventObject<TouchEvent> | Konva.KonvaEventObject<MouseEvent>,
  ) {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) setIsSelected(null);
  }

  // Handle INPUT Photo
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
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
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
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
        onMouseDown={handleClickStage}
        onTouchStart={handleClickStage}
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
                  isSelected={isSelected === e.id}
                  handleSelectElement={handleSelectElement}
                  updateElementState={updateElementState}
                  handleTransformEnd={handleTransformEndElement}
                  key={e.id}
                  element={e as StickerElementType}
                />
              );
          })}
        </Layer>
      </Stage>
    </div>
  );
});

export default Canva;

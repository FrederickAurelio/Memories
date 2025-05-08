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
  LineRopeElementType,
  PhotoElementType,
  ShapeElementType,
  SplineRopeElementType,
  StickerElementType,
  TextElementType,
} from "@/app/_lib/types";
import Konva from "konva";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";

function ViewOnlyCanva({ elements }: { elements: ElementType[] }) {
  const [isSelectedId, setIsSelectedId] = useState<null | string>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
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
    <div ref={containerRef} className="flex h-full w-full">
      <Stage
        onMouseDown={(e) => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) setIsSelectedId(null);
        }}
        onTouchStart={(e) => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) setIsSelectedId(null);
        }}
        width={stageSize.width}
        height={stageSize.height}
        ref={stageRef}
      >
        <Layer>
          {elements.map((e) => {
            if (e.type === "photo")
              return (
                <PhotoImage
                  draggable={false}
                  isSelected={false}
                  mode="view"
                  key={e.id}
                  element={e as PhotoElementType}
                />
              );
            else if (e.type.startsWith("shape"))
              return (
                <Shapes
                  draggable={false}
                  isSelected={false}
                  mode="view"
                  key={e.id}
                  element={e as ShapeElementType}
                />
              );
            else if (e.type.startsWith("sticker"))
              return (
                <Sticker
                  draggable={false}
                  isSelected={false}
                  mode="view"
                  key={e.id}
                  element={e as StickerElementType}
                />
              );
            else if (e.type.startsWith("draw"))
              return (
                <Draw
                  draggable={false}
                  isSelected={false}
                  mode="view"
                  key={e.id}
                  element={e as DrawElementType}
                />
              );
            else if (e.type.startsWith("rope-spline"))
              return (
                <SplineRope
                  draggable={false}
                  isSelected={false}
                  mode="view"
                  key={e.id}
                  element={e as SplineRopeElementType}
                />
              );
            else if (e.type.startsWith("rope-line"))
              return (
                <LineRope
                  draggable={false}
                  isSelected={false}
                  mode="view"
                  key={e.id}
                  element={e as LineRopeElementType}
                />
              );
            else if (e.type.startsWith("text"))
              return (
                <Text
                  draggable={false}
                  isSelected={false}
                  mode="view"
                  key={e.id}
                  element={e as TextElementType}
                />
              );
          })}
        </Layer>
      </Stage>
    </div>
  );
}

export default ViewOnlyCanva;

"use client";

const ViewOnlyPhotoImage = dynamic(
  () => import("@/canva_components/ViewOnlyPhotoImage"),
  {
    ssr: false,
  },
);
const ViewOnlyShapes = dynamic(
  () => import("@/canva_components/ViewOnlyShapes"),
  {
    ssr: false,
  },
);
const ViewOnlySticker = dynamic(
  () => import("@/canva_components/ViewOnlySticker"),
  {
    ssr: false,
  },
);
const ViewOnlyDraw = dynamic(() => import("@/canva_components/ViewOnlyDraw"), {
  ssr: false,
});
const ViewOnlySplineRope = dynamic(
  () => import("@/canva_components/ViewOnlySplineRope"),
  {
    ssr: false,
  },
);
const ViewOnlyLineRope = dynamic(
  () => import("@/canva_components/ViewOnlyLineRope"),
  {
    ssr: false,
  },
);
const ViewOnlyText = dynamic(() => import("@/canva_components/ViewOnlyText"), {
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
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";

function ViewOnlyCanva({
  photoImageMode,
  elements,
  isSelectedId,
  setIsSelectedId,
}: {
  photoImageMode: "view" | "edit";
  elements: ElementType[];
  isSelectedId: string | null;
  setIsSelectedId: Dispatch<SetStateAction<string | null>>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  function handleSelectElement(id: string | null) {
    setIsSelectedId(id);
  }

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
                <ViewOnlyPhotoImage
                  mode={photoImageMode}
                  isSelectedId={isSelectedId}
                  handleSelectElement={handleSelectElement}
                  key={e.id}
                  element={e as PhotoElementType}
                />
              );
            else if (e.type.startsWith("shape"))
              return (
                <ViewOnlyShapes key={e.id} element={e as ShapeElementType} />
              );
            else if (e.type.startsWith("sticker"))
              return (
                <ViewOnlySticker key={e.id} element={e as StickerElementType} />
              );
            else if (e.type.startsWith("draw"))
              return <ViewOnlyDraw key={e.id} element={e as DrawElementType} />;
            else if (e.type.startsWith("rope-spline"))
              return (
                <ViewOnlySplineRope
                  key={e.id}
                  element={e as SplineRopeElementType}
                />
              );
            else if (e.type.startsWith("rope-line"))
              return (
                <ViewOnlyLineRope
                  key={e.id}
                  element={e as LineRopeElementType}
                />
              );
            else if (e.type.startsWith("text"))
              return <ViewOnlyText key={e.id} element={e as TextElementType} />;
          })}
        </Layer>
      </Stage>
    </div>
  );
}

export default ViewOnlyCanva;

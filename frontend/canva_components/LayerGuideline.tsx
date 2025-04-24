"use client";
import { Layer } from "react-konva";
import {
  drawGuides,
  getGuides,
  getLineGuideStops,
  getObjectSnappingEdges,
} from "./guideline.js";
import { RefObject, useRef } from "react";
import Konva from "konva";
import { Stage } from "konva/lib/Stage.js";
function LayerGuideline({
  children,
  stageRef,
}: {
  children: React.ReactNode;
  stageRef: RefObject<Stage | null>;
}) {
  const layerRef = useRef<Konva.Layer>(null);
  return (
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
        const lineGuideStops = getLineGuideStops(e.target, stageRef.current);
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
      {children}
    </Layer>
  );
}

export default LayerGuideline;

export type BaseElementType = {
  id: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  opacity: number;
};

export type PhotoElementType = {
  type: "photo";
  src: string;
} & BaseElementType;

export type ShapeElementType = {
  type:
    | "shape-rect"
    | "shape-circle"
    | "shape-triangle"
    | "shape-star"
    | "shape-hexagon"
    | "shape-arrow"
    | "shape-heart";
  strokeWidth: number;
  stroke: string;
  strokeDash?: boolean;
  fill: string;
  sides?: number;
  radius?: number;
  numPoints?: number;
  innerRadius?: number;
  outerRadius?: number;
} & BaseElementType;

export type StickerElementType = {
  type: "sticker";
  src: string;
  strokeWidth: number;
  stroke: string;
  strokeDash?: boolean;
} & BaseElementType;

export type DrawElementType = {
  type: "draw";
  id: string;
  points: number[];
  x: number;
  y: number;
  rotation: number;
  strokeWidth: number;
  stroke: string;
  strokeDash?: boolean;
  opacity: number;
};

export type SplineRopeElementType = {
  type: "rope-spline";
  id: string;
  strokeWidth: number;
  stroke: string;
  strokeDash?: boolean;
  x: number;
  y: number;
  points: [
    { x: number; y: number },
    { x: number; y: number },
    { x: number; y: number }
  ];
  opacity: number;
};

export type LineRopeElementType = {
  type: "rope-line";
  id: string;
  strokeWidth: number;
  stroke: string;
  strokeDash?: boolean;
  x: number;
  y: number;
  points: [{ x: number; y: number }, { x: number; y: number }];
  opacity: number;
};

export type TextElementType = {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  strokeWidth: number;
  strokeDash?: boolean;
  stroke: string;
  align: "center" | "right" | "left" | "justify";
  bold: boolean;
  italic: boolean;
  underline: boolean;
  lineThrough: boolean;
} & BaseElementType;

export type ElementType =
  | PhotoElementType
  | ShapeElementType
  | StickerElementType
  | DrawElementType
  | SplineRopeElementType
  | LineRopeElementType
  | TextElementType;

export type PhotoMetadata = {
  imageId: string;
  title: string;
  date: Date;
  description: string;
};

import { z } from "zod";

// Common base
const baseElementSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  rotation: z.number(),
  width: z.number(),
  height: z.number(),
  opacity: z.number(),
});

// Photo
const photoElementSchema = baseElementSchema.extend({
  type: z.literal("photo"),
  src: z.string(),
});

// Shape
const shapeElementSchema = baseElementSchema.extend({
  type: z.enum([
    "shape-rect",
    "shape-circle",
    "shape-triangle",
    "shape-star",
    "shape-hexagon",
    "shape-arrow",
    "shape-heart",
  ]),
  strokeWidth: z.number(),
  stroke: z.string(),
  strokeDash: z.boolean().optional(),
  fill: z.string(),
  sides: z.number().optional(),
  radius: z.number().optional(),
  numPoints: z.number().optional(),
  innerRadius: z.number().optional(),
  outerRadius: z.number().optional(),
});

// Sticker
const stickerElementSchema = baseElementSchema.extend({
  type: z.literal("sticker"),
  src: z.string(),
  strokeWidth: z.number(),
  stroke: z.string(),
  strokeDash: z.boolean().optional(),
});

// Draw
const drawElementSchema = z.object({
  type: z.literal("draw"),
  id: z.string(),
  points: z.array(z.number()),
  x: z.number(),
  y: z.number(),
  rotation: z.number(),
  strokeWidth: z.number(),
  stroke: z.string(),
  strokeDash: z.boolean().optional(),
  opacity: z.number(),
});

// Spline Rope
const splineRopeElementSchema = z.object({
  type: z.literal("rope-spline"),
  id: z.string(),
  strokeWidth: z.number(),
  stroke: z.string(),
  strokeDash: z.boolean().optional(),
  x: z.number(),
  y: z.number(),
  points: z.tuple([
    z.object({ x: z.number(), y: z.number() }),
    z.object({ x: z.number(), y: z.number() }),
    z.object({ x: z.number(), y: z.number() }),
  ]),
  opacity: z.number(),
});

// Line Rope
const lineRopeElementSchema = z.object({
  type: z.literal("rope-line"),
  id: z.string(),
  strokeWidth: z.number(),
  stroke: z.string(),
  strokeDash: z.boolean().optional(),
  x: z.number(),
  y: z.number(),
  points: z.tuple([
    z.object({ x: z.number(), y: z.number() }),
    z.object({ x: z.number(), y: z.number() }),
  ]),
  opacity: z.number(),
});

// Text
const textElementSchema = baseElementSchema.extend({
  type: z.literal("text"),
  text: z.string(),
  fontSize: z.number(),
  fontFamily: z.string(),
  fill: z.string(),
  strokeWidth: z.number(),
  strokeDash: z.boolean().optional(),
  stroke: z.string(),
  align: z.enum(["center", "right", "left", "justify"]),
  bold: z.boolean(),
  italic: z.boolean(),
  underline: z.boolean(),
  lineThrough: z.boolean(),
});

// Union
export const elementSchema = z.discriminatedUnion("type", [
  photoElementSchema,
  shapeElementSchema,
  stickerElementSchema,
  drawElementSchema,
  splineRopeElementSchema,
  lineRopeElementSchema,
  textElementSchema,
]);

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
  date: Date | null;
  description: string;
};

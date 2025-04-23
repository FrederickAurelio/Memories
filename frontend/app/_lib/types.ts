import Konva from "konva";
import { JSX, RefObject } from "react";
import { IconType } from "react-icons";

export type FetchResponse = {
  success: boolean;
  message: string;
  errors: Record<string, string>;
};

export type UserProfile = {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

export type SidebarLinkOptionType = {
  type: "link";
  name: string;
  href: string;
  icon: IconType;
  iconFill: IconType;
};
export type SidebarPopoverOptionType = {
  type: "popover";
  name: string;
  href: string;
  icon: IconType;
  iconFill: IconType;
  content: () => JSX.Element;
};

export type SidebarOptionType =
  | SidebarLinkOptionType
  | SidebarPopoverOptionType;

export type ToolType = {
  id: string;
  type: "tool";
  name: string;
  icon: IconType;
};

export type ToolCustomType = {
  id: string;
  type: "custom";
  name: string;
  icon: IconType;
  content({ onSelect }: { onSelect(s: string): void }): JSX.Element;
};

export type ToolMenuType = {
  id: string;
  type: "menu";
  name: string;
  icon: IconType;
  content: ToolType[];
};

export type ToolBoxOptionType = ToolType | ToolMenuType | ToolCustomType;

export type elRefType = RefObject<Konva.Group | null> &
  RefObject<Konva.Shape | null> &
  RefObject<Konva.Rect | null> &
  RefObject<Konva.Ellipse | null> &
  RefObject<Konva.Star | null> &
  RefObject<Konva.Arrow | null> &
  RefObject<Konva.Image | null> &
  RefObject<Konva.RegularPolygon | null>;

export type BaseElementType = {
  id: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
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
};

export type SplineRopeElementType = {
  type: "rope-spline";
  id: string;
  strokeWidth: number;
  stroke: string;
  x: number;
  y: number;
  points: [
    { x: number; y: number },
    { x: number; y: number },
    { x: number; y: number },
  ];
};

export type LineRopeElementType = {
  type: "rope-line";
  id: string;
  strokeWidth: number;
  stroke: string;
  x: number;
  y: number;
  points: [{ x: number; y: number }, { x: number; y: number }];
};

export type ElementType =
  | PhotoElementType
  | ShapeElementType
  | StickerElementType
  | DrawElementType
  | SplineRopeElementType
  | LineRopeElementType;

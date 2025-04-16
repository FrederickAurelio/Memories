import { IconType } from "react-icons";
import { JSX } from "react";

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
  type: "shape";
} & BaseElementType;

export type ElementType = PhotoElementType | ShapeElementType;

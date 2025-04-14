import {
  Circle,
  EraserIcon,
  Heart,
  Hexagon,
  ImagePlus,
  MousePointer2,
  PenIcon,
  PenLine,
  ShapesIcon,
  Spline,
  SquareIcon,
  Star,
  Triangle,
  Type,
} from "lucide-react";
import { AiFillPlusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { BsChatQuote, BsFillChatQuoteFill } from "react-icons/bs";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoMail, IoMailOutline } from "react-icons/io5";
import { PiLineSegmentBold } from "react-icons/pi";
import { SiElement } from "react-icons/si";
import { SidebarOptionType, ToolBoxOptionType } from "../_lib/types";
import Notifications from "../app/Notifications";
import AIElement from "../app/design/[canvaId]/AIElement";

export const BACKEND_BASE_URL = "http://localhost:2000";
export const FRONTEND_BASE_URL = "http://localhost:3000";

export const imageMargin = 10;
export const imageMarginBot = 15 + imageMargin;

// TOOLBOX //////////////////////////////////////////////////////////
export const toolboxOptions: ToolBoxOptionType[] = [
  { id: "select", type: "tool", name: "Select", icon: MousePointer2 },
  {
    id: "draw",
    type: "menu",
    name: "Draw",
    icon: PenLine,
    content: [
      {
        id: "draw-pen",
        type: "tool",
        name: "Pen",
        icon: PenIcon,
      },
      {
        id: "draw-eraser",
        type: "tool",
        name: "Eraser",
        icon: EraserIcon,
      },
    ],
  },
  {
    id: "shape",
    type: "menu",
    name: "Shapes",
    icon: ShapesIcon,
    content: [
      {
        id: "shape-rect",
        type: "tool",
        name: "Rectangle",
        icon: SquareIcon,
      },
      {
        id: "shape-circle",
        type: "tool",
        name: "Circle",
        icon: Circle,
      },
      {
        id: "shape-triangle",
        type: "tool",
        name: "Triangle",
        icon: Triangle,
      },
      {
        id: "shape-star",
        type: "tool",
        name: "Star",
        icon: Star,
      },
      {
        id: "shape-hexagon",
        type: "tool",
        name: "Hexagon",
        icon: Hexagon,
      },
      {
        id: "shape-heart",
        type: "tool",
        name: "Heart",
        icon: Heart,
      },
    ],
  },
  { id: "photo", type: "tool", name: "Photo", icon: ImagePlus },
  {
    id: "element",
    type: "custom",
    name: "AI Element",
    icon: SiElement,
    content: AIElement,
  },
  // element and AIElement-{data}
  {
    id: "rope",
    type: "menu",
    name: "Ropes",
    icon: PiLineSegmentBold,
    content: [
      {
        id: "rope-line",
        type: "tool",
        name: "Line",
        icon: PiLineSegmentBold,
      },
      {
        id: "rope-spline",
        type: "tool",
        name: "Spline",
        icon: Spline,
      },
    ],
  },
  { id: "text", type: "tool", name: "Text", icon: Type },
];

// SIDEBAR /////////////////////////////////////////////////////////
export const sidebarOptions: SidebarOptionType[] = [
  {
    type: "link",
    name: "Home",
    href: "/app",
    icon: GoHome,
    iconFill: GoHomeFill,
  },
  {
    type: "link",
    name: "Chats",
    href: "/app/chats",
    icon: BsChatQuote,
    iconFill: BsFillChatQuoteFill,
  },
  {
    type: "link",
    name: "Create",
    href: "/app/design/123",
    icon: AiOutlinePlusCircle,
    iconFill: AiFillPlusCircle,
  },
  {
    type: "popover",
    name: "Mail",
    href: "",
    icon: IoMailOutline,
    iconFill: IoMail,
    content: Notifications,
  },
];

import {
  ArrowUp,
  Circle,
  EraserIcon,
  Heart,
  Hexagon,
  ImagePlus,
  MousePointer2,
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
import AISticker from "../app/design/[canvaId]/AISticker";

export const BACKEND_BASE_URL = "http://localhost:2000";
export const FRONTEND_BASE_URL = "http://localhost:3000";

export const undoRedoStack = 12;
export const strokeDashGap = 4;
export const imageMargin = 7;
export const imageMarginBot = 10 + imageMargin;

// TOOLBOX //////////////////////////////////////////////////////////
export const mainToolboxOptions: ToolBoxOptionType[] = [
  { id: "select", type: "tool", name: "Select", icon: MousePointer2 },
  {
    id: "draw-pen",
    type: "tool",
    name: "Pen",
    icon: PenLine,
  },
  {
    id: "draw-eraser",
    type: "tool",
    name: "Eraser",
    icon: EraserIcon,
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
        id: "shape-arrow",
        type: "tool",
        name: "Arrow",
        icon: ArrowUp,
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
    id: "sticker",
    type: "custom",
    name: "AI Sticker",
    icon: SiElement,
    content: AISticker,
  },
  // sticker and AISticker-{data}
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

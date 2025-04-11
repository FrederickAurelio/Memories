import { AiFillPlusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { BsChatQuote, BsFillChatQuoteFill } from "react-icons/bs";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoMail, IoMailOutline } from "react-icons/io5";
import { SidebarOptionType, ToolBoxOptionType } from "../_lib/types";
import Notifications from "../app/Notifications";
import {
  MousePointer2,
  PenLine,
  ShapesIcon,
  SquareIcon,
  Type,
} from "lucide-react";
import { PiLineSegment } from "react-icons/pi";

export const BACKEND_BASE_URL = "http://localhost:2000";
export const FRONTEND_BASE_URL = "http://localhost:3000";

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
        id: "shapes-rect",
        type: "tool",
        name: "Rectangle",
        icon: SquareIcon,
      },
    ],
  },
  {
    id: "shapes",
    type: "menu",
    name: "Shapes",
    icon: ShapesIcon,
    content: [
      {
        id: "shapes-rect",
        type: "tool",
        name: "Rectangle",
        icon: SquareIcon,
      },
    ],
  },
  {
    id: "lines",
    type: "menu",
    name: "Lines",
    icon: PiLineSegment,
    content: [
      {
        id: "shapes-rect",
        type: "tool",
        name: "Rectangle",
        icon: SquareIcon,
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

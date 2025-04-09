"use client";
import { AiFillPlusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { BsChatQuote, BsFillChatQuoteFill } from "react-icons/bs";
import { GoHome, GoHomeFill } from "react-icons/go";
import Avatar from "../_components/Avatar";
import SidebarPopover from "./SidebarPopover";
import SidebarLink from "./SidebarLink";
import Link from "next/link";
import { IoMail, IoMailOutline } from "react-icons/io5";
import Notifications from "./Notifications";
import { SidebarOptionType } from "../_lib/types";
import { usePathname } from "next/navigation";

const sidebarOptions: SidebarOptionType[] = [
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

function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="flex w-20 flex-col items-center gap-8 py-8">
      {sidebarOptions.map((bar) =>
        bar.type === "link" ? (
          <SidebarLink key={bar.name} bar={bar} pathname={pathname} />
        ) : (
          <SidebarPopover bar={bar} key={bar.name}>
            <bar.content />
          </SidebarPopover>
        ),
      )}

      <div className="flex flex-grow items-end">
        <Link href={"/app/profile/:id"}>
          <Avatar
            className="h-12 w-12 cursor-pointer"
            alt={"Frederick"}
            src={"/Frederick.jpeg"}
          />
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;

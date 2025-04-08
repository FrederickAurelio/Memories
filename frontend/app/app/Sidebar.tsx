import { PlusCircle } from "lucide-react";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsChatQuote, BsFillChatQuoteFill } from "react-icons/bs";
import { GoHome, GoHomeFill } from "react-icons/go";
import Avatar from "../_components/Avatar";
import SidebarMailButton from "./SidebarMailButton";
import SidebarLink from "./SidebarLink";

const sidebarOptions = [
  {
    name: "Home",
    href: "/app",
    icon: GoHome,
    iconFill: GoHomeFill,
  },
  {
    name: "Chats",
    href: "/app/chats",
    icon: BsChatQuote,
    iconFill: BsFillChatQuoteFill,
  },
  {
    name: "Create",
    href: "/app/create",
    icon: PlusCircle,
    iconFill: AiFillPlusCircle,
  },
];
function Sidebar({ pathname }: { pathname: string | null }) {
  return (
    <div className="flex w-20 flex-col items-center gap-8 py-8">
      {sidebarOptions.map((bar) => (
        <SidebarLink key={bar.href} bar={bar} pathname={pathname} />
      ))}
      <SidebarMailButton />
      <div className="flex flex-grow items-end">
        <Avatar
          className="h-12 w-12 cursor-pointer"
          alt={"Frederick"}
          src={"/Frederick.jpeg"}
        />
      </div>
    </div>
  );
}

export default Sidebar;

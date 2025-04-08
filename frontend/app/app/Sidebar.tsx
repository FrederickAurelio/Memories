import { PlusCircle } from "lucide-react";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsChatQuote, BsFillChatQuoteFill } from "react-icons/bs";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoMail, IoMailOutline } from "react-icons/io5";
import SidebarLink from "./SidebarLink";
import SidebarButtonModal from "./SidebarButtonModal";
import FriendRequest from "../_components/FriendRequest";
import Avatar from "../_components/Avatar";

const sidebarOptions = [
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
    href: "/app/create",
    icon: PlusCircle,
    iconFill: AiFillPlusCircle,
  },
  {
    type: "button",
    name: "Mail",
    href: "/app/notif",
    icon: IoMailOutline,
    iconFill: IoMail,
  },
];
function Sidebar({ pathname }: { pathname: string | null }) {
  return (
    <div className="flex w-20 flex-col items-center gap-8 py-8">
      {sidebarOptions.map((bar) =>
        bar.type === "link" ? (
          <SidebarLink key={bar.href} bar={bar} pathname={pathname} />
        ) : (
          <SidebarButtonModal key={bar.href} bar={bar}>
            <h1 className="text-xl font-bold">Notifications</h1>
            <div className="flex h-52 flex-col overflow-y-scroll">
              {/* <div className="flex h-5/6 flex-col items-center justify-center opacity-60">
                <p>You&apos;re all caught up!</p>
                <p>No new notifications yet.</p>
              </div> */}
              <FriendRequest
                user={{
                  firstName: "Frederick",
                  lastName: "Aurelio Halim",
                  avatar: "/Frederick.jpeg",
                }}
              />
            </div>
          </SidebarButtonModal>
        ),
      )}
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

"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { IoMail, IoMailOutline } from "react-icons/io5";
import FriendRequest from "../_components/FriendRequest";

function SidebarMailButton() {
  const [open, setOpen] = useState(false);
  const Icon = open ? IoMail : IoMailOutline;
  return (
    <Popover onOpenChange={(o) => setOpen(o)}>
      <PopoverTrigger>
        <div className="group flex cursor-pointer flex-col items-center">
          <Icon
            className={`rounded-lg ${open ? "bg-neutral-300/80" : ""} p-[7px] transition-colors duration-150 group-hover:bg-neutral-300/80`}
            size={42}
          />
          <span className="mt-0.5 text-xs font-semibold">Mail</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96" side="right">
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
      </PopoverContent>
    </Popover>
  );
}

export default SidebarMailButton;

"use client";
import Avatar from "../_components/Avatar";
import SidebarPopover from "./SidebarPopover";
import SidebarLink from "./SidebarLink";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarOptions } from "../_lib/const";

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

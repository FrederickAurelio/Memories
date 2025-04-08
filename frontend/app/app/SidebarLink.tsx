import Link from "next/link";
import { IconType } from "react-icons";

function SidebarLink({
  bar,
  pathname,
}: {
  bar: {
    type: string;
    name: string;
    href: string;
    icon: IconType;
    iconFill: IconType;
  };
  pathname: string | null;
}) {
  return (
    <Link
      href={bar.href}
      className="group flex cursor-pointer flex-col items-center"
    >
      {pathname === bar.href && (
        <bar.iconFill
          className={`rounded-lg bg-neutral-300/80 p-[7px]`}
          size={42}
        />
      )}
      {pathname !== bar.href && (
        <bar.icon
          className={`rounded-lg p-[7px] transition-colors duration-150 group-hover:bg-neutral-300/80`}
          size={42}
        />
      )}
      <span className="mt-0.5 text-xs font-semibold">{bar.name}</span>
    </Link>
  );
}

export default SidebarLink;

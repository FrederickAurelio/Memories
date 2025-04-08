import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconType } from "react-icons";

function SidebarButtonModal({
  bar,
  children,
}: {
  bar: {
    type: string;
    name: string;
    href: string;
    icon: IconType;
    iconFill: IconType;
  };
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="group flex cursor-pointer flex-col items-center">
          <bar.icon
            className={`rounded-lg p-[7px] transition-colors duration-150 group-hover:bg-neutral-300/80`}
            size={42}
          />
          <span className="mt-0.5 text-xs font-semibold">{bar.name}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96" side="right">
        {children}
      </PopoverContent>
    </Popover>
  );
}

export default SidebarButtonModal;

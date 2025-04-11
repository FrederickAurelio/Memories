import { ToolType } from "@/app/_lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Tool({
  toolbox,
  onSelect,
  selectedTool,
  closePop,
}: {
  toolbox: ToolType;
  onSelect(s: string): void;
  selectedTool: string;
  closePop?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <toolbox.icon
          onClick={() => {
            onSelect(toolbox.id);
            if (closePop) closePop();
          }}
          size={38}
          className={`cursor-pointer rounded-lg p-[6px] hover:bg-neutral-300/50 ${selectedTool === toolbox.id ? "bg-neutral-300/50" : ""}`}
        />
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{toolbox.name}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default Tool;

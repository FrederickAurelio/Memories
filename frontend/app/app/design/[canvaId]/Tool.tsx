import { ToolType } from "@/app/_lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useElements } from "../../../_context/ElementContext";

function Tool({ toolbox }: { toolbox: ToolType }) {
  const { selectedTool, handleSelectTool } = useElements();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <toolbox.icon
          onClick={() => {
            handleSelectTool(toolbox.id);
          }}
          size={40}
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

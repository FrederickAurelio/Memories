import { toolboxOptions } from "@/app/_lib/const";
import Tool from "./Tool";
import ToolMenu from "./ToolMenu";
import { ToolCustomType, ToolType } from "@/app/_lib/types";
import ToolCustom from "./ToolCustom";

function Toolbox() {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-2 shadow-[0_1px_15px_rgba(38,38,38,0.25)]">
      {toolboxOptions.map((toolbox) =>
        toolbox.type === "menu" ? (
          <ToolMenu
            toolbox={toolbox}
            key={toolbox.id}
          />
        ) : toolbox.type === "tool" ? (
          <Tool
            toolbox={toolbox as ToolType}
            key={toolbox.id}
          />
        ) : (
          <ToolCustom
            toolbox={toolbox as ToolCustomType}
            key={toolbox.id}
          />
        ),
      )}
    </div>
  );
}

export default Toolbox;

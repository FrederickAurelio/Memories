import { TbLoader2 } from "react-icons/tb";

function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <TbLoader2 size={120} className="animate-spin text-neutral-800" />
    </div>
  );
}

export default Loading;

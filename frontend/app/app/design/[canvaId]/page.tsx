import { ElementProvider } from "@/app/_context/ElementContext";
import DesignPage from "./DesginPage";

async function Design({ params }: { params: Promise<{ canvaId: string }> }) {
  const { canvaId } = await params;
  return (
    <div className="grid h-full w-full grid-cols-[repeat(14,minmax(0,1fr))]">
      <ElementProvider>
        <DesignPage canvaId={canvaId} />
      </ElementProvider>
    </div>
  );
}

export default Design;

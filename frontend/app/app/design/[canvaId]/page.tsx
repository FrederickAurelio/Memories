import { ElementProvider } from "@/app/_context/ElementContext";
import DesignPage from "./DesginPage";

async function Design({ params }: { params: Promise<{ canvaId: string }> }) {
  const { canvaId } = await params;
  console.log(canvaId);
  return (
    <div className="grid h-full w-full grid-cols-[repeat(14,minmax(0,1fr))]">
      <ElementProvider>
        <DesignPage />
      </ElementProvider>
    </div>
  );
}

export default Design;

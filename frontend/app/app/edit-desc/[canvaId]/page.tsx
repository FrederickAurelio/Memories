import { getCanvaForEditOnly } from "@/app/_lib/canva/action";
import EditDescPage from "./EditDescPage";

async function editDesc({ params }: { params: Promise<{ canvaId: string }> }) {
  const { canvaId } = await params;

  const canvaData = await getCanvaForEditOnly(canvaId);

  return (
    <div className="flex h-full w-full items-center justify-between">
      <EditDescPage canvaData={canvaData} />
    </div>
  );
}

export default editDesc;

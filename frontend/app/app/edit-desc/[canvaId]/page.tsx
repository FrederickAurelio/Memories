import { getCanvaForEditOnly } from "@/app/_lib/canva/action";
import EditDescPage from "./EditDescPage";

async function editDesc({ params }: { params: Promise<{ canvaId: string }> }) {
  const { canvaId } = await params;

  const canvaData = await getCanvaForEditOnly(canvaId);

  return (
    <div className="flex h-full w-full items-center">
      <div className="flex h-full w-full bg-red-100">a</div>
      <EditDescPage canvaData={canvaData} />
    </div>
  );
}

export default editDesc;

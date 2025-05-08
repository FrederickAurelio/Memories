import { getCanva } from "@/app/_lib/canva/action";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import EditDescPage from "./EditDescPage";

async function editDesc({ params }: { params: Promise<{ canvaId: string }> }) {
  const { canvaId } = await params;

  const canvaData = await getCanva(canvaId);
  if (!canvaData?.success) {
    if (canvaData?.message.includes("not found")) {
      toast.error("Canva with specified ID is not found returning back to app");
    } else if (canvaData?.message.includes("Access denied")) {
      toast.error(
        "You have no permission to edit with this canva, returning back to app",
      );
    }
    redirect("/app");
  }

  return (
    <div className="flex h-full w-full items-center">
      <div className="bg-red-100 flex h-full w-full">a</div>
      <EditDescPage elements={canvaData.data.elements} />
    </div>
  );
}

export default editDesc;

import ToolContent from "./ToolContent";

async function Design({ params }: { params: Promise<{ canvaId: string }> }) {
  const { canvaId } = await params;
  console.log(canvaId);
  return (
    <div className="grid h-full w-full grid-cols-[repeat(14,minmax(0,1fr))]">
      <ToolContent />
    </div>
  );
}

export default Design;

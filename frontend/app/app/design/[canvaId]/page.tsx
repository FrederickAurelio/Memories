import DesignPage from "./DesginPage";

async function Design({ params }: { params: Promise<{ canvaId: string }> }) {
  const { canvaId } = await params;
  console.log(canvaId);
  return (
    <div className="grid h-full w-full grid-cols-[repeat(14,minmax(0,1fr))]">
      <DesignPage />
    </div>
  );
}

export default Design;

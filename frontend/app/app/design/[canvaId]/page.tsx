async function Design({ params }: { params: Promise<{ canvaId: string }> }) {
  const { canvaId } = await params;
  return (
    <div className="grid h-full w-full grid-cols-[repeat(14,minmax(0,1fr))]">
      <div className="col-span-1 bg-red-100">TOOLBOX</div>
      <div className="col-start-2 col-end-[15] flex w-full items-center justify-center p-1">
        <div className="aspect-video h-full bg-white shadow-[0_1px_20px_rgba(38,38,38,0.20)]">
          CANVA
        </div>
      </div>
    </div>
  );
}

export default Design;

async function page({ params }: { params: Promise<{ canvaId: string }> }) {
  const { canvaId } = await params;
  return <div>Canva Desig: {canvaId}</div>;
}

export default page;

"use client";
import Button from "@/app/_components/Button";
import { canvaInitialState, useElements } from "@/app/_context/ElementContext";
import { saveCanvaDesign } from "@/app/_lib/canva/action";
import { FetchResponse } from "@/app/_lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TbLoader2 } from "react-icons/tb";
import { toast } from "sonner";

type addOnRes = {
  data: {
    canvaId: string;
  };
};

function SaveCanvaButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    elements,
    canva,
    setElements,
    setCurStateStack,
    setStateStack,
    setCanva,
  } = useElements();

  const [isPending, setIsPending] = useState(false);

  function resetState() {
    setCanva(canvaInitialState);
    setElements([]);
    setCurStateStack(0);
    setStateStack([]);
    setOpen(false);
  }

  async function handleSave() {
    if (elements.length <= 0 || canva.title.length <= 2) return;
    setIsPending(true);

    if (canva._id === "new") {
      const saveResult = (await saveCanvaDesign(
        canva.title,
        elements,
      )) as FetchResponse & addOnRes;
      if (saveResult?.success) {
        resetState();
        toast.success(saveResult.message);
        setTimeout(
          () => router.push(`/app/edit-info/${saveResult.data.canvaId}`),
          500,
        );
      } else {
        toast.error(saveResult?.message);
      }
    } else {
      const updateResult = (await saveCanvaDesign(
        canva.title,
        elements,
        canva._id,
      )) as FetchResponse & addOnRes;
      if (updateResult?.success) {
        resetState();
        toast.success(updateResult.message);
        setTimeout(
          () => router.push(`/app/edit-info/${updateResult.data.canvaId}`),
          500,
        );
      } else {
        if (
          updateResult?.message.includes("not found") ||
          updateResult?.message.includes("Access denied")
        ) {
          toast.error(
            "We couldn't find the design to update, so we've saved as a new one for you instead.",
          );
          const result = (await saveCanvaDesign(
            canva.title,
            elements,
          )) as FetchResponse & addOnRes;
          if (result?.success) {
            resetState();
            toast.success(result.message);
            setTimeout(
              () => router.push(`/app/edit-info/${result.data.canvaId}`),
              500,
            );
          } else {
            toast.error(result?.message);
          }
        } else {
          toast.error(updateResult?.message);
        }
      }
    }

    setIsPending(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-fit">
          <Button
            disabled={isPending || elements.length <= 0}
            className="flex justify-center rounded-xl px-3 py-1 duration-75 hover:scale-100 hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            size="small"
            variant="secondary"
          >
            {isPending ? (
              <TbLoader2 size={32} className="animate-spin text-neutral-800" />
            ) : (
              <SaveIcon size={32} />
            )}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Your Design</DialogTitle>
          <DialogDescription>
            Give your design a name so you can find it later.
          </DialogDescription>
        </DialogHeader>
        <input
          disabled={isPending}
          id="canvaTitle"
          placeholder="Enter a title..."
          value={canva.title}
          onChange={(e) => {
            setCanva((c) => {
              return { ...c, title: e.target.value.slice(0, 60) };
            });
          }}
          className="w-full rounded-lg border-2 border-neutral-300 p-2 text-lg disabled:cursor-not-allowed disabled:border-neutral-200"
        />
        <DialogFooter>
          <Button
            disabled={
              isPending || elements.length <= 0 || canva.title.length <= 2
            }
            onClick={handleSave}
            className="rounded-lg py-1 transition-none hover:scale-100 hover:border-neutral-700 hover:bg-neutral-700"
            size="small"
            variant="primary"
          >
            {isPending
              ? "Saving..."
              : elements.length <= 0
                ? "Design is empty"
                : "Save Design"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SaveCanvaButton;

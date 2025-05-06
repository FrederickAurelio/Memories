"use client";
import Button from "@/app/_components/Button";
import { useElements } from "@/app/_context/ElementContext";
import { saveCanvaDesign } from "@/app/_lib/canva/action";
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
import { useState, useTransition } from "react";
import { TbLoader2 } from "react-icons/tb";

function SaveCanvaButton() {
  const { elements } = useElements();
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    if (elements.length <= 0 || title === "") return;
    startTransition(() => {
      saveCanvaDesign(title, elements);
    });
  }
  return (
    <Dialog>
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
          value={title}
          onChange={(e) => {
            setTitle(e.target.value.slice(0, 60));
          }}
          className="w-full rounded-lg border-2 border-neutral-300 p-2 text-lg disabled:cursor-not-allowed disabled:border-neutral-200"
        />
        <DialogFooter>
          <Button
            disabled={isPending || elements.length <= 0}
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

"use client";

import Button from "@/app/_components/Button";
import { canvaInitialState, useElements } from "@/app/_context/ElementContext";
import { getCurrentUserWithCookies } from "@/app/_lib/auth/action";
import { getCanva } from "@/app/_lib/canva/action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

function LoadStateDialog({
  setIsDesign,
  canvaId,
}: {
  setIsDesign: Dispatch<SetStateAction<boolean>>;
  canvaId: string;
}) {
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { canva, elements, setElements, setStateStack, setCanva } =
    useElements();

  const handleClose = (answer: boolean) => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(answer);
    }
  };

  useEffect(() => {
    async function fn() {
      const userData = await getCurrentUserWithCookies();
      if (userData?.success) {
        const { _id: userId } = userData.data;
        let loadLocalData = false;
        let message = "";
        let redirectTo = "";

        if (
          canva._id &&
          canva.userId &&
          elements.length > 0 &&
          canva.userId === userId
        ) {
          setIsOpen(true);
          loadLocalData = await new Promise((resolve) =>
            setResolvePromise(() => resolve),
          );
        }
        if (loadLocalData) {
          setIsDesign(true);
        } else {
          if (canvaId === "new") {
            setTimeout(() => {
              setElements([]);
              setCanva({
                title: "",
                _id: "new",
                userId: userId.toString(),
              });
              setStateStack([]);
              setIsDesign(true);
            }, 300);
          } else {
            async function fetchEls() {
              const canvaData = await getCanva(canvaId);
              if (canvaData?.success) {
                const { elements, title, _id } = canvaData.data;
                setElements(elements);
                setCanva({
                  title: title,
                  _id: _id,
                  userId: userId.toString(),
                });
                setStateStack([elements]);
                setIsDesign(true);
                return;
              } else if (canvaData?.message.includes("not found")) {
                message =
                  "Seems like the canva design is not found, redirecting to new design";
                redirectTo = "/app/design/new";
              } else if (canvaData?.message.includes("Access denied")) {
                message =
                  "Seems like the canva design is not yours, redirecting to view only";
                redirectTo = `/app/canva/${canvaId}`;
              }

              setElements([]);
              setCanva(canvaInitialState);
              setStateStack([]);
              if (message) toast.error(message);
              if (redirectTo) {
                setTimeout(() => {
                  router.push(redirectTo);
                }, 1500);
              }
            }
            fetchEls();
          }
        }
      }
    }
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-[425px] [&>button:last-child]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Unsaved Design Found</DialogTitle>
          <DialogDescription>
            We found an unsaved design. Would you like to continue working on it
            or start fresh?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => handleClose(false)}
            className="rounded-lg py-1 text-sm transition-none hover:scale-x-100 hover:scale-y-100 hover:border-red-600 hover:text-red-600"
            size="small"
            variant="secondary"
          >
            Discard and
            {canvaId !== "new" ? " Edit Selected Canva" : " Start New"}
          </Button>
          <Button
            onClick={() => handleClose(true)}
            className="rounded-lg py-1 text-sm transition-none hover:scale-100 hover:scale-x-100 hover:scale-y-100 hover:opacity-80"
            size="small"
            variant="primary"
          >
            Continue Editing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LoadStateDialog;

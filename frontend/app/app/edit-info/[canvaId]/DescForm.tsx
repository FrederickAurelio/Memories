"use client";

import { PhotoMetadata } from "@/app/_lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, InfoIcon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { Button as ShadCnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import Button from "@/app/_components/Button";
import { updateCanvaPhotoInfo } from "@/app/_lib/canva/action";
import { TbLoader2 } from "react-icons/tb";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  canvaId: string | undefined;
  canvaTitle: string | undefined;
  photoDescriptions: PhotoMetadata[];
  isSelectedId: string | null;
};

function DescForm({
  canvaTitle,
  photoDescriptions,
  isSelectedId,
  canvaId,
}: Props) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [titleState, setTitlteState] = useState(canvaTitle);
  const [photoDescState, setPhotoDescState] = useState(photoDescriptions);
  const opt = [
    { id: "imageId", label: "Image ID", value: isSelectedId as string },
    {
      id: "title",
      label: "Image Title",
      value: photoDescState.find((pds) => pds.imageId === isSelectedId)?.title,
    },
    {
      id: "date",
      label: "Image Date",
      value: photoDescState.find((pds) => pds.imageId === isSelectedId)?.date,
    },
    {
      id: "description",
      label: "Image Description",
      value: photoDescState.find((pds) => pds.imageId === isSelectedId)
        ?.description,
    },
  ] as const;

  async function handleSave() {
    setIsPending(true);
    const data = await updateCanvaPhotoInfo(
      titleState,
      photoDescState,
      canvaId,
    );
    if (data?.success) {
      toast.success(data.message);
      setTimeout(() => {
        router.push(`/app/canva/${canvaId}`);
      }, 750);
    } else toast.error(data?.message);
    setIsPending(false);
  }
  return (
    <>
      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          disabled={(titleState ? titleState.length <= 2 : true) || isPending}
          className="mb-3 flex items-center justify-center gap-1 rounded-lg border-neutral-700 py-1 text-neutral-700 duration-75 hover:scale-x-100 hover:scale-y-100 hover:border-red-600 hover:text-red-600 disabled:opacity-50"
          variant="secondary"
          size="small"
        >
          {isPending ? (
            <TbLoader2 size={28} className="animate-spin" />
          ) : (
            <SaveIcon size={28} />
          )}
          <p className="text-lg">{isPending ? "Saving..." : "Save"}</p>
        </Button>
      </div>
      <div className="mb-4 flex flex-col">
        <label className="text-sm text-neutral-500" htmlFor="canvaTitle">
          Canva Title (at least 3 char)
        </label>
        <input
          name="canvaTitle"
          id="canvaTitle"
          className={`w-full rounded-lg border-2 border-neutral-300 p-2 disabled:cursor-not-allowed disabled:border-neutral-200`}
          value={titleState}
          onChange={(e) => {
            setTitlteState(e.target.value.slice(0, 60));
          }}
        />
      </div>
      {!isSelectedId && (
        <div className="flex gap-1 text-sm text-neutral-400">
          <InfoIcon size={28} />
          <p className="w-fit">
            Select a polaroid photo in the canvas to edit its information here.
          </p>
        </div>
      )}
      {isSelectedId &&
        opt.map((inp) => {
          if (inp.id !== "date" && inp.id !== "description") {
            return (
              <div key={inp.id} className="flex flex-col">
                <label className="text-sm text-neutral-500" htmlFor={inp.id}>
                  {inp.label}
                </label>
                <input
                  disabled={inp.id === "imageId"}
                  name={inp.id}
                  id={inp.id}
                  className={`w-full rounded-lg border-2 border-neutral-300 px-2 py-1 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-400/70`}
                  value={inp.value}
                  onChange={(e) => {
                    setPhotoDescState((pds) => {
                      return pds.map((pd) => {
                        if (pd.imageId !== isSelectedId) return pd;
                        else
                          return {
                            ...pd,
                            [inp.id]: e.target.value.slice(0, 60),
                          };
                      });
                    });
                  }}
                />
              </div>
            );
          } else if (inp.id === "description") {
            return (
              <div key={inp.id} className="flex flex-col">
                <label className="text-sm text-neutral-500" htmlFor={inp.id}>
                  {inp.label}
                </label>
                <Textarea
                  name={inp.id}
                  id={inp.id}
                  className={`h-40 w-full rounded-lg border-2 border-neutral-300 p-2 disabled:cursor-not-allowed disabled:border-neutral-200`}
                  value={inp.value}
                  onChange={(e) => {
                    setPhotoDescState((pds) => {
                      return pds.map((pd) => {
                        if (pd.imageId !== isSelectedId) return pd;
                        else
                          return {
                            ...pd,
                            [inp.id]: e.target.value.slice(0, 350),
                          };
                      });
                    });
                  }}
                />
              </div>
            );
          } else if (inp.id === "date") {
            return (
              <div key={inp.id} className="flex flex-col">
                <label className="text-sm text-neutral-500" htmlFor={inp.id}>
                  {inp.label}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <ShadCnButton
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start border-2 border-neutral-300 text-left font-normal",
                        !inp.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {inp.value ? (
                        format(inp.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </ShadCnButton>
                  </PopoverTrigger>
                  <PopoverContent side="right" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={inp.value}
                      onSelect={(e) => {
                        setPhotoDescState((pds) => {
                          return pds.map((pd) => {
                            if (pd.imageId !== isSelectedId) return pd;
                            else
                              return {
                                ...pd,
                                [inp.id]: e || new Date(),
                              };
                          });
                        });
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            );
          }
        })}
    </>
  );
}

export default DescForm;

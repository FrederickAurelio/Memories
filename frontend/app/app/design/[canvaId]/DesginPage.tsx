"use client";

import { useElements } from "@/app/_context/ElementContext";
import { mainToolboxOptions } from "@/app/_lib/const";
import { Redo2Icon, Undo2Icon, ZoomIn, ZoomOut } from "lucide-react";
import dynamic from "next/dynamic";
import EditToolBar from "./EditToolBar";
import SaveCanvaButton from "./SaveCanvaButton";
import Toolbox from "./Toolbox";
import { useEffect, useState } from "react";
import { getCanva } from "@/app/_lib/canva/action";
import { useRouter } from "next/navigation";
const Canva = dynamic(() => import("@/canva_components/Canva"), {
  ssr: false,
});

function DesignPage({ canvaId }: { canvaId: string }) {
  const router = useRouter();
  const {
    zoom,
    curStateStack,
    stateStack,
    isSelectedId,
    setElements,
    setTitle,
    setStateStack,
  } = useElements();
  const [isDesign, setIsDesign] = useState(false);

  useEffect(() => {
    // check localstorage is empty or not
    // add new localstorage with "new || :id"

    // If there's unsaved data in localStorage, prompt the user:
    // "You have an unsaved design. Do you want to continue working on it?"

    // if yes redirect to new or canvaId after that use localstorage data

    // also when save setLocal to null so we can check double local

    // if user click no
    if (canvaId === "new") {
      ///
      // set local to NEW
      setTimeout(() => {
        setElements([]);
        setTitle("");
        setStateStack([]);
        setIsDesign(true);
      }, 300);
    } else {
      async function fetchEls() {
        const data = await getCanva(canvaId);
        if (data?.success) {
          const { elements, title } = data.data;
          ///
          // set local to :id
          setElements(elements);
          setTitle(title);
          setStateStack([elements]);
        } else if (data?.message.includes("not found")) {
          router.push("/app/design/new");
        } else if (data?.message.includes("Access denied")) {
          router.push(`/app/canva/${canvaId}`);
        }
      }
      fetchEls();
      setIsDesign(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isDesign && (
        <>
          <div className="relative col-start-1 col-end-2 flex flex-col items-end justify-around">
            <SaveCanvaButton />

            <Toolbox
              toolboxOptions={[
                {
                  id: "undo",
                  type: "tool",
                  name: "Undo (Ctrl + Z)",
                  icon: Undo2Icon,
                  disabled: curStateStack >= stateStack.length - 1,
                },
                {
                  id: "redo",
                  type: "tool",
                  name: "Redo (Ctrl + Shift + Z)",
                  icon: Redo2Icon,
                  disabled: curStateStack <= 0,
                },
              ]}
            />
            <Toolbox toolboxOptions={mainToolboxOptions} />
            <Toolbox
              toolboxOptions={[
                {
                  id: "zoom-in",
                  type: "tool",
                  name: "Zoom-In",
                  icon: ZoomIn,
                  disabled: zoom >= 200,
                },
                {
                  id: "zoom-out",
                  type: "tool",
                  name: "Zoom-Out",
                  icon: ZoomOut,
                  disabled: zoom <= 10,
                },
              ]}
            />
          </div>

          <div className="relative col-start-2 col-end-[15] flex w-full flex-col items-center justify-center p-3">
            {isSelectedId && <EditToolBar />}
            <div
              style={{
                transform: `scaleX(${zoom}%) scaleY(${zoom}%)`,
              }}
              className={`aspect-video w-[1200] bg-white shadow-[0_1px_20px_rgba(38,38,38,0.20)]`}
            >
              <Canva />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default DesignPage;

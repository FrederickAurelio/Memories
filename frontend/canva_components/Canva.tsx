"use client";
import { ElementType } from "@/app/_lib/types";
import { useLocalStorage } from "@uidotdev/usehooks";
import Konva from "konva";
import dynamic from "next/dynamic";
import { memo, useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
const PhotoImage = dynamic(() => import("@/canva_components/PhotoImage"), {
  ssr: false,
});

const Canva = memo(function Canva({
  selectedTool,
  handleSelect,
}: {
  selectedTool: string;
  handleSelect(s: string): void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [elements, setElements] = useLocalStorage<ElementType[]>(
    "elements",
    [],
  );
  const [isSelected, setIsSelected] = useState<string | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function updateElementState(updatedEl: ElementType) {
    setElements((elements) =>
      elements.map((element) =>
        element.id === updatedEl.id ? updatedEl : element,
      ),
    );
  }

  function removeElement(id: string) {
    setElements((elements) => elements.filter((el) => el.id !== id));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setElements((e) => {
        return [
          ...e,
          {
            type: "photo",
            id: new Date().toISOString(),
            x: 300,
            y: 50,
            src: base64,
            rotation: 0,
            width: 0,
            height: 0,
          },
        ];
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  }

  function handleClickStage(
    e: Konva.KonvaEventObject<TouchEvent> | Konva.KonvaEventObject<MouseEvent>,
  ) {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) setIsSelected(null);
  }

  useEffect(() => {
    if (selectedTool === "photo") {
      if (inputRef.current) inputRef.current.click();
      handleSelect("select");
    }
  }, [handleSelect, selectedTool]);

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setStageSize({ width: offsetWidth, height: offsetHeight });
      }
    }

    updateSize();
    window.addEventListener("resize", updateSize);
  }, []);

  return (
    <div ref={containerRef} className="flex h-full w-full bg-red-100">
      <input
        ref={inputRef}
        onChange={handleFileChange}
        type="file"
        accept="image/*"
        className="hidden"
      />
      <Stage
        onMouseDown={handleClickStage}
        onTouchStart={handleClickStage}
        width={stageSize.width}
        height={stageSize.height}
        ref={stageRef}
      >
        <Layer>
          {elements.map((e) => {
            if (e.type === "photo")
              return (
                <PhotoImage
                  stageSize={stageSize}
                  isSelected={isSelected === e.id}
                  setIsSelected={setIsSelected}
                  updateElementState={updateElementState}
                  removeElement={removeElement}
                  key={e.id}
                  element={e}
                />
              );
          })}
        </Layer>
      </Stage>
    </div>
  );
});

export default Canva;

"use client";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useRef } from "react";
import { Layer, Stage } from "react-konva";
import PhotoImage from "./PhotoImage";
import { ElementType } from "@/app/_lib/types";

function Canva({ selectedTool }: { selectedTool: string }) {
  const [elements, setElements] = useLocalStorage<ElementType[]>(
    "elements",
    [],
  );
  const stageRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function updateElementState(updatedEl: ElementType) {
    setElements((elements) =>
      elements.map((element) =>
        element.id === updatedEl.id ? updatedEl : element,
      ),
    );
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
    };
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    if (selectedTool === "photo") {
      if (inputRef.current) inputRef.current.click();
    }
  }, [selectedTool]);

  return (
    <div className="flex h-full w-full bg-red-100">
      <input
        ref={inputRef}
        onChange={handleFileChange}
        type="file"
        accept="image/*"
        className="hidden"
      />
      <Stage ref={stageRef} className="w-full">
        <Layer>
          {elements.map((e) => {
            if (e.type === "photo")
              return (
                <PhotoImage
                  updateElementState={updateElementState}
                  key={e.id}
                  element={e}
                />
              );
          })}
        </Layer>
      </Stage>
    </div>
  );
}

export default Canva;

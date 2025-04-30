"use client";

import { useElements } from "@/app/_context/ElementContext";
import imageCompression from "browser-image-compression";
import { RefObject } from "react";

type Props = {
  inputRef: RefObject<HTMLInputElement | null>;
  inputImageType: "photo" | "sticker";
  stageSize: {
    width: number;
    height: number;
  };
};

function InputImageCanva({ inputRef, inputImageType, stageSize }: Props) {
  const { addElement } = useElements();
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 540,
    });
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (inputImageType === "sticker")
        addElement({
          type: inputImageType,
          id: new Date().toISOString(),
          x: stageSize.width / 2,
          y: stageSize.height / 2,
          src: base64,
          rotation: 0,
          width: 0,
          height: 0,
          stroke: "#262626",
          strokeWidth: 0,
          strokeDash: false,
          opacity: 1,
        });
      else
        addElement({
          type: inputImageType,
          id: new Date().toISOString(),
          x: stageSize.width / 2,
          y: stageSize.height / 2,
          src: base64,
          rotation: 0,
          width: 0,
          height: 0,
          opacity: 1,
        });

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };
    reader.readAsDataURL(compressedFile);
  }

  return (
    <input
      ref={inputRef}
      onChange={handleFileChange}
      type="file"
      accept="image/*"
      className="hidden"
    />
  );
}

export default InputImageCanva;

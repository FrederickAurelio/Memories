"use client";

import { RefObject } from "react";
import imageCompression from "browser-image-compression";
import { useElements } from "@/app/_context/ElementContext";

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
      maxSizeMB: 1,
      maxWidthOrHeight: 400,
    });
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      addElement({
        type: inputImageType as "photo" | "sticker",
        id: new Date().toISOString(),
        x: stageSize.width / 2,
        y: stageSize.height / 2,
        src: base64,
        rotation: 0,
        width: 0,
        height: 0,
        stroke: "#262626",
        strokeWidth: 0,
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

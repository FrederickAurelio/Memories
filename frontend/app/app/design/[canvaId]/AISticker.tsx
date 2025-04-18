"use client";

import Button from "@/app/_components/Button";
import { useState } from "react";
import { SiElement } from "react-icons/si";

function AIElement({ onSelect }: { onSelect(s: string): void }) {
  const [inputValue, setInputValue] = useState("");
  return (
    <div className="flex w-80 flex-col gap-1 p-1">
      <div className="flex items-center gap-1 text-2xl font-semibold">
        <SiElement size={30} />
        <h1>AI Sticker Generator</h1>
      </div>
      <p className="text-sm text-neutral-500">
        Describe the sticker you want to generate. Be as specific as possible,
        e.g.
        <span className="italic">
          {" "}
          &quot;A cat sitting on a space rocket&quot;
        </span>
        .
      </p>
      <input
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
        required
        className="w-full rounded-lg border-2 border-neutral-300 p-2 text-sm focus:border-black focus:outline-none"
        type="text"
        placeholder="Type your prompt here..."
      />
      <Button
        onClick={() => onSelect(`AISticker-${inputValue}`)}
        disabled={inputValue === ""}
        size="small"
        className="rounded-lg py-2 text-sm font-semibold hover:scale-x-100 hover:scale-y-100 hover:opacity-90 disabled:hover:opacity-100"
        variant="primary"
      >
        Generate Sticker
      </Button>
      <div className="grid w-full grid-cols-9 justify-between pt-2">
        <span className="col-span-4 mt-2 border-t-2 border-neutral-400"></span>
        <span className="col-span-1 -translate-y-0.5 text-center text-sm">
          OR
        </span>
        <span className="col-span-4 mt-2 border-t-2 border-neutral-400"></span>
      </div>
      <Button
        onClick={() => onSelect("sticker")}
        size="small"
        className="rounded-lg py-2 text-sm font-semibold hover:scale-x-100 hover:scale-y-100 hover:opacity-70"
        variant="secondary"
      >
        Upload own Sticker/Image
      </Button>
    </div>
  );
}

export default AIElement;

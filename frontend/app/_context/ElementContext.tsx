"use client";

import {
  ElementType,
  elRefType,
  PhotoElementType,
  ShapeElementType,
  StickerElementType,
  TextElementType,
} from "@/app/_lib/types";
import Konva from "konva";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node.js";
import {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useLocalStorage } from "../_hooks/useLocalStorage";
import { undoRedoStack } from "../_lib/const";

export type ElementContextType = {
  elements: ElementType[];
  copiedElement: ElementType | null;
  isSelectedId: string | null;
  selectedTool: string;
  isDrawing: RefObject<"none" | "drawing" | "erasing">;
  zoom: number;
  stateStack: ElementType[][];
  curStateStack: number;
  canva: {
    title: string;
    _id: string;
    userId: string;
  };
  setElements: (value: SetStateAction<ElementType[]>) => void;
  updateElementState(updatedEl: ElementType, skipUpdateStack?: boolean): void;
  handleSelectElement(elementId: string | null): void;
  removeElement(id: string): void;
  addElement(el: ElementType, skipUpdateStack?: boolean): void;
  handleSelectTool(s: string): void;
  isOutsideStage(node: Konva.Node): boolean;
  handleTransformEndElement(
    e:
      | Konva.KonvaEventObject<DragEvent>
      | KonvaEventObject<Event, Node<NodeConfig>>,
    element:
      | PhotoElementType
      | ShapeElementType
      | StickerElementType
      | TextElementType,
    elRef: elRefType,
  ): void;
  zoomIn(): void;
  zoomOut(): void;
  updateStack(newEls: ElementType[]): void;
  setCurStateStack: Dispatch<SetStateAction<number>>;
  setCopiedElement: Dispatch<SetStateAction<ElementType | null>>;
  setStateStack: Dispatch<SetStateAction<ElementType[][]>>;
  setCanva: Dispatch<
    SetStateAction<{
      title: string;
      _id: string;
      userId: string;
    }>
  >;
};

const ElementContext = createContext<ElementContextType | null>(null);

export const canvaInitialState = {
  title: "",
  _id: "",
  userId: "",
};

function ElementProvider({ children }: { children: React.ReactNode }) {
  const [canva, setCanva] = useLocalStorage("canva", canvaInitialState);
  const [elements, setElements] = useLocalStorage<ElementType[]>(
    "elements",
    [],
  );
  const [isSelectedId, setIsSelected] = useState<string | null>(null);
  const [copiedElement, setCopiedElement] = useState<ElementType | null>(null);
  const [selectedTool, setSelectedTool] = useState("select");
  const isDrawing = useRef<"none" | "drawing" | "erasing">("none");

  const [stateStack, setStateStack] = useState<ElementType[][]>([elements]);
  const [curStateStack, setCurStateStack] = useState(0);

  function updateStack(newEls: ElementType[]) {
    if (curStateStack !== 0) {
      const newStack = stateStack.filter((_, i) => i >= curStateStack);
      setStateStack([newEls, ...newStack]);
      setCurStateStack(0);
    }
    if (curStateStack === 0)
      setStateStack((stacks) =>
        [newEls, ...stacks].slice(0, undoRedoStack + 1),
      );
  }

  function handleSelectTool(s: string) {
    setSelectedTool(s);
  }

  useEffect(() => {
    setElements(stateStack[curStateStack]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curStateStack]);

  function updateElementState(updatedEl: ElementType, skipUpdateStack = false) {
    try {
      const newEls = elements.map((element) =>
        element.id === updatedEl.id ? updatedEl : element,
      );
      setElements(newEls);
      if (!skipUpdateStack) updateStack(newEls);
    } catch (e) {
      console.log(e);
      toast.error(
        "Oops! Your canvas is full. Remove some items to continue editing or export your design.",
      );
    }
  }

  function handleSelectElement(elementId: string | null) {
    if (elementId === null) setIsSelected(null);
    if (!selectedTool.startsWith("draw") && isDrawing.current === "none")
      setIsSelected(elementId);
  }

  function removeElement(id: string) {
    const newEls = elements.filter((el) => el.id !== id);
    setElements(newEls);
    updateStack(newEls);
    setIsSelected(null);
  }

  function addElement(el: ElementType, skipUpdateStack = false) {
    try {
      const newEls = [...elements, el];
      setElements(newEls);
      if (!skipUpdateStack) updateStack(newEls);
      handleSelectElement(el.id);
    } catch (e) {
      console.log(e);
      toast.error(
        "Oops! Your canvas is full. Remove some items to continue editing or export your design.",
      );
    }
  }

  function isOutsideStage(node: Konva.Node) {
    const stage = node.getStage();
    if (!stage) return false;
    const nodeBox = node.getClientRect({ relativeTo: stage });
    return (
      nodeBox.x + nodeBox.width < 0 ||
      nodeBox.y + nodeBox.height < 0 ||
      nodeBox.x > stage.width() ||
      nodeBox.y > stage.height()
    );
  }

  function handleTransformEndElement(
    e:
      | Konva.KonvaEventObject<DragEvent>
      | KonvaEventObject<Event, Node<NodeConfig>>,
    element:
      | PhotoElementType
      | ShapeElementType
      | StickerElementType
      | TextElementType,
    elRef: elRefType,
  ) {
    if (!elRef.current) return;
    const { x, y, rotation, scaleX, scaleY } = e.target.attrs;
    if (!isOutsideStage(elRef.current)) {
      const newWidth = Math.max(5, element.width * scaleX);
      const newHeight = Math.max(element.height * scaleY);
      updateElementState({
        ...element,
        x,
        y,
        rotation,
        width: newWidth,
        height: newHeight,
      });
      elRef.current.scaleX(1);
      elRef.current.scaleY(1);
    } else {
      removeElement(element.id);
    }
  }

  const [zoom, setZoom] = useState(100);
  function zoomIn() {
    if (zoom < 200) setZoom((z) => z + 10);
  }
  function zoomOut() {
    if (zoom > 10) setZoom((z) => z - 10);
  }

  return (
    <ElementContext.Provider
      value={{
        copiedElement,
        isSelectedId,
        elements,
        selectedTool,
        isDrawing,
        zoom,
        stateStack,
        curStateStack,
        canva,
        setCopiedElement,
        setElements,
        updateElementState,
        handleSelectElement,
        removeElement,
        addElement,
        handleSelectTool,
        isOutsideStage,
        handleTransformEndElement,
        zoomIn,
        zoomOut,
        updateStack,
        setCurStateStack,
        setStateStack,
        setCanva,
      }}
    >
      {children}
    </ElementContext.Provider>
  );
}

function useElements() {
  const context = useContext(ElementContext) as ElementContextType;
  if (!context) console.error("Using context outside the provider");
  return context;
}

export { ElementProvider, useElements };

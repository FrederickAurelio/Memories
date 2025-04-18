import { ElementType, StickerElementType } from "@/app/_lib/types";
import Konva from "konva";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { RefObject } from "react";

type Props = {
  element: StickerElementType;
  isSelected: boolean;
  handleSelectElement(elementId: string): void;
  updateElementState(updatedEl: ElementType): void;
  handleTransformEnd(
    e:
      | Konva.KonvaEventObject<DragEvent>
      | KonvaEventObject<Event, Node<NodeConfig>>,
    element: ElementType,
    elRef: RefObject<Konva.Group | null>,
  ): void;
};

function Sticker({
  element,
  isSelected,
  handleSelectElement,
  updateElementState,
  handleTransformEnd,
}: Props) {
  return <div></div>;
}

export default Sticker;

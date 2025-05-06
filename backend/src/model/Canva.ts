import { model, Schema, SchemaDefinitionProperty, Types } from "mongoose";
import { ElementType, PhotoMetadata } from "../types";

type Canva = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  elements: ElementType[];
  photoDescriptions: PhotoMetadata[];
  createdAt: Date;
  updatedAt: Date;
};

const CanvaSchema = new Schema<Canva>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: [3, "Title must be at least 3 characters long."],
      maxlength: [60, "Title cannot exceed 60 characters."],
    },
    elements: {
      type: [Schema.Types.Mixed],
      required: true,
    } as SchemaDefinitionProperty<ElementType[]>,
    photoDescriptions: {
      type: [
        {
          imageId: { type: String, required: true },
          title: {
            type: String,
            required: true,
            minlength: [3, "Title must be at least 3 characters long."],
            maxlength: [60, "Title cannot exceed 60 characters."],
          },
          date: { type: Date, required: true },
          description: {
            type: String,
            required: true,
            minlength: [5, "Description must be at least 5 characters long."],
            maxlength: [300, "Description cannot exceed 300 characters."],
          },
        },
      ],
      default: [],
      _id: false,
    },
  },
  { timestamps: true }
);

const Canva = model("Canva", CanvaSchema);
export default Canva;

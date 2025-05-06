import { z } from "zod";
import { errorHandlers } from "../helpers";
import { Request, Response } from "express";
import { elementSchema } from "../types";
import Canva from "../model/Canva";

const saveCanvaSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long.")
    .max(60, "Title cannot exceed 60 characters."),
  elements: z.array(elementSchema),
});
export async function saveCanva(req: Request, res: Response) {
  const userId = req.session.userId;
  if (!userId)
    return void res.status(401).json({
      success: false,
      message: `Not authorized!`,
      errors: {},
    });
  const data = req.body;
  try {
    const { title, elements } = saveCanvaSchema.parse(data);
    const photoDescriptions = elements
      .filter((el) => el.type === "photo" || el.type === "sticker")
      .map((el) => {
        return { imageId: el.id, title: "", date: null, description: "" };
      });

    const newCanva = new Canva({
      userId: userId,
      title: title,
      elements: elements,
      photoDescriptions: photoDescriptions,
    });

    await newCanva.save();

    return void res.status(200).json({
      success: true,
      message: "Canva saved successfully!",
      errors: {},
    });
  } catch (error: any) {
    const { errors, message } = errorHandlers(error);
    const statusCode = message.includes("validation") ? 400 : 500;

    return void res.status(statusCode).json({
      success: false,
      message: message,
      errors: errors,
    });
  }
}

export async function getCanva(req: Request, res: Response) {
  const userId = req.session.userId;
  if (!userId)
    return void res.status(401).json({
      success: false,
      message: `Not authorized!`,
      errors: {},
    });
  const { canvaId } = req.params;
  try {
    const canva = await Canva.findById(canvaId);
    if (!canva)
      return void res.status(404).json({
        success: false,
        message: "Design with the specified ID was not found.",
        errors: {},
      });

    if (canva.userId.toString() !== userId.toString())
      return void res.status(404).json({
        success: false,
        message: "Access denied to this design.",
        errors: {},
      });

    return void res.status(200).json({
      success: true,
      message: "Fetch canva successfully!",
      data: canva,
      errors: {},
    });
  } catch (error: any) {
    const { errors, message } = errorHandlers(error);
    const statusCode = message.includes("validation") ? 400 : 500;

    return void res.status(statusCode).json({
      success: false,
      message: message,
      errors: errors,
    });
  }
}

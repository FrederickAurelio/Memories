import { Request, Response } from "express";
import path from "path";
import { z } from "zod";
import { errorHandlers } from "../helpers";
import Canva from "../model/Canva";
import User, { UserType } from "../model/User";
import { elementSchema, PhotoMetadata } from "../types";
import Friend from "../model/Friend";

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
      .filter((el) => el.type === "photo")
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
      data: {
        canvaId: newCanva._id,
      },
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

export async function updateCanva(req: Request, res: Response) {
  const userId = req.session.userId;
  if (!userId)
    return void res.status(401).json({
      success: false,
      message: `Not authorized!`,
      errors: {},
    });
  const { canvaId } = req.params;
  const data = req.body;
  try {
    const { title, elements } = saveCanvaSchema.parse(data);
    const photoDescriptions = elements
      .filter((el) => el.type === "photo")
      .map((el) => {
        return { imageId: el.id, title: "", date: null, description: "" };
      });

    const canva = await Canva.findById(canvaId);
    if (!canva)
      return void res.status(404).json({
        success: false,
        message: "Design with the specified ID was not found.",
        errors: {},
      });

    if (canva.userId.toString() !== userId.toString())
      return void res.status(401).json({
        success: false,
        message: "Access denied to this design.",
        errors: {},
      });

    canva.title = title;
    canva.elements = elements;
    canva.photoDescriptions = photoDescriptions.map((pd) => {
      const alreadyExist = canva.photoDescriptions.find(
        (oldPd) => oldPd.imageId === pd.imageId
      );
      return alreadyExist ? alreadyExist : pd;
    });

    await canva.save();

    return void res.status(200).json({
      success: true,
      message: "Canva update successfully!",
      errors: {},
      data: {
        canvaId: canva._id,
      },
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

const updateCanvaPhotoInfoSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long.")
    .max(60, "Title cannot exceed 60 characters."),
  photoDescriptions: z.array(
    z.object({
      imageId: z.string(),
      title: z.string().optional(),
      date: z.string().nullable().optional(),
      description: z.string().optional() || z.null(),
    })
  ),
});
export async function updateCanvaPhotoInfo(req: Request, res: Response) {
  const userId = req.session.userId;
  if (!userId)
    return void res.status(401).json({
      success: false,
      message: `Not authorized!`,
      errors: {},
    });
  const { canvaId } = req.params;
  const data = req.body;

  try {
    const { title, photoDescriptions } = updateCanvaPhotoInfoSchema.parse(data);

    const canva = await Canva.findById(canvaId);
    if (!canva)
      return void res.status(404).json({
        success: false,
        message: "Design with the specified ID was not found.",
        errors: {},
      });

    if (canva.userId.toString() !== userId.toString())
      return void res.status(401).json({
        success: false,
        message: "Access denied to this design.",
        errors: {},
      });

    canva.title = title;
    canva.photoDescriptions = canva.photoDescriptions.map((cpd) => {
      return {
        ...photoDescriptions.find((pd) => cpd.imageId === pd.imageId),
        imageId: cpd.imageId,
      };
    }) as PhotoMetadata[];

    await canva.save();
    return void res.status(200).json({
      success: true,
      message: "Canva information update successfully!",
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
    const canva = await Canva.findById(canvaId).populate<{
      userId: Pick<UserType, "_id" | "isPublicProfile">;
    }>("userId", "_id isPublicProfile");

    if (!canva)
      return void res.status(404).json({
        success: false,
        message: "Design with the specified ID was not found.",
        errors: {},
      });

    if (!canva.userId.isPublicProfile) {
      const isFriend = await Friend.findOne({
        status: "accepted",
        $or: [
          { recipientId: userId, requesterId: canva.userId._id },
          { recipientId: canva.userId._id, requesterId: userId },
        ],
      });
      if (!isFriend) {
        if (canva.userId._id.toString() !== userId.toString())
          return void res.status(401).json({
            success: false,
            message: "Access denied to this design.",
            errors: {},
            data: {
              userId: {
                _id: canva.userId._id,
              },
            },
          });
      }
    }

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

export async function getImage(req: Request, res: Response) {
  const userId = req.session.userId;
  if (!userId)
    return void res.status(401).json({
      success: false,
      message: `Not authorized!`,
      errors: {},
    });

  const { imageId } = req.params;

  const imageOwnerId = imageId.split("-")[0];
  const imageOwner = await User.findById(imageOwnerId);
  if (!imageOwner) {
    return void res.status(404).json({
      success: false,
      message: `The Image is no longer available!`,
      errors: {},
    });
  }

  if (!imageOwner.isPublicProfile) {
    const isFriend = await Friend.findOne({
      status: "accepted",
      $or: [
        { recipientId: userId, requesterId: imageOwner._id },
        { recipientId: imageOwner._id, requesterId: userId },
      ],
    });
    if (!isFriend) {
      if (imageOwnerId !== userId.toString()) {
        return void res.status(401).json({
          success: false,
          message: `Not authorized!`,
          errors: {},
        });
      }
    }
  }

  try {
    const imagePath = path.join(process.cwd(), "uploads", imageId);
    res.sendFile(imagePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        return res.status(500).json({
          success: false,
          message: "An error occurred while trying to send the image.",
          errors: err,
        });
      }
    });
  } catch (error: any) {
    console.error("Error:", error);
    const { errors, message } = errorHandlers(error);
    const statusCode = message.includes("validation") ? 400 : 500;

    return void res.status(statusCode).json({
      success: false,
      message: message,
      errors: errors,
    });
  }
}

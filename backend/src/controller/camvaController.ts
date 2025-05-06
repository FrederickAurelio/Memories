import { z } from "zod";
import { errorHandlers } from "../helpers";
import { Request, Response } from "express";

// const saveCanvaSchema = z.object({
//   email: z.string().email("Invalid email format"),
// });
export async function saveCanva(req: Request, res: Response) {
  const data = req.body;
  console.log(data)
  try {
    // const { email } = saveCanvaSchema.parse(data);
   
    return res.status(200).json({
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

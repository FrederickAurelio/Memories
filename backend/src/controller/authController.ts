import { NextFunction, Request, Response } from "express";
import User from "../model/User";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { z } from "zod";
import { errorHandlers } from "../helpers";

// Authentication middleware
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.userId) return next();
  res.status(401).send({ msg: "Not Authenticated" });
}

const registerUserByEmailSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must must contain at least 2 characters")
    .max(15, "First name cannot exceed 15 characters"),
  lastName: z
    .string()
    .max(20, "Last name cannot exceed 20 characters")
    .optional(),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

export async function registerUserByEmail(req: Request, res: Response) {
  const data = req.body;
  try {
    const { firstName, lastName, password, email } =
      registerUserByEmailSchema.parse(data);

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return void res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const salt = genSaltSync(12);
    const hashedPassword = hashSync(password, salt);

    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();

    return void res.status(201).json({
      success: true,
      message: "User registered successfully",
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

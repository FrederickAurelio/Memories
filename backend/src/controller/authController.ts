import { NextFunction, Request, Response } from "express";
import User from "../model/User";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { z } from "zod";
import { createTransport } from "nodemailer";
import { errorHandlers } from "../helpers";
import * as crypto from "crypto";

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
        errors: {
          email: "Email already exists",
        },
      });
    }

    const salt = genSaltSync(12);
    const hashedPassword = hashSync(password, salt);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      firstName: firstName,
      email: email,
      password: hashedPassword,
      verificationToken,
    });

    const transporter = createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Memories account Verification Link",
      text: `Hello, ${firstName} ${
        lastName ? lastName : ""
      } Please verify your email by clicking this link : http://localhost:2000/api/auth/verify-email/${verificationToken}/${
        newUser._id
      }`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });

    await newUser.save();

    return void res.status(201).json({
      success: true,
      message: "User registered successfully",
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

export async function verifyEmailCallback(req: Request, res: Response) {
  const { verificationToken, userId } = req.params;
  try {
    const verifiedTokenUser = await User.findById(userId);
    if (verifiedTokenUser?.isEmailVerified) {
      return void res.status(200).json({
        success: true,
        message: "You have already verified your email, Please log in",
        errors: {},
      });
    }

    if (verifiedTokenUser?.verificationToken !== verificationToken) {
      return void res.status(400).json({
        success: false,
        message:
          "Your verification link may have expired or invalid. Please click on resend for verify your Email",
        errors: {
          verifiedToken: "Invalid",
        },
      });
    }

    verifiedTokenUser.isEmailVerified = true;
    verifiedTokenUser.verificationToken = "";
    await verifiedTokenUser.save();

    return void res.status(200).json({
      success: true,
      message: "Verify email successfully",
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

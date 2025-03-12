import { NextFunction, Request, Response } from "express";
import User from "../model/User";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import { z } from "zod";
import { createTransport } from "nodemailer";
import { errorHandlers, sendEmail } from "../helpers";
import * as crypto from "crypto";
import { add, isPast } from "date-fns";

// Authentication middleware
export async function isAuthenticatedTest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.userId) {
    const currentUser = await User.findById(req.session.userId);
    return void res.status(200).json({
      message: `Authenticated: ${currentUser?.firstName}`,
    });
  }
  res.status(401).send({ msg: "Not Authenticated" });
}

const sendEmailVerificationSchema = z.object({
  email: z.string().email("Invalid email format"),
});
export async function sendEmailVerification(req: Request, res: Response) {
  const data = req.body;
  try {
    const { email } = sendEmailVerificationSchema.parse(data);

    const resendEmailUser = await User.findOne({ email });
    if (!resendEmailUser) {
      return void res.status(404).json({
        success: false,
        message: "There is no account with this email",
        errors: {
          email: "There is no account with this email",
        },
      });
    }
    if (
      resendEmailUser.lastSentEmail === null ||
      !isPast(resendEmailUser.lastSentEmail)
    ) {
      return void res.status(400).json({
        success: false,
        message:
          "You need to wait at least 1 minutes to resend the email verification",
        errors: {},
      });
    }
    if (resendEmailUser.isEmailVerified) {
      return void res.status(409).json({
        success: false,
        message: "This account is already verified",
        errors: {},
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const lastSentEmail = add(new Date(), { minutes: 1 });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Memories account Verification Link",
      text: `Hello, ${resendEmailUser.firstName} ${
        resendEmailUser.lastName
      } Please verify your email by clicking this link : ${
        process.env.FRONTEND_URL
      }/auth/verify-email/callback?verificationToken=${encodeURIComponent(
        verificationToken
      )}&userId=${encodeURIComponent(resendEmailUser._id.toString())}`,
    };

    resendEmailUser.verificationToken = verificationToken;
    resendEmailUser.lastSentEmail = lastSentEmail;
    await resendEmailUser.save();

    sendEmail(mailOptions);

    return void res.status(200).json({
      success: true,
      message: "Send email verification successfully",
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
      lastName: lastName,
      email: email,
      password: hashedPassword,
      verificationToken,
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Memories account Verification Link",
      text: `Hello, ${firstName} ${
        lastName ? lastName : ""
      } Please verify your email by clicking this link : ${
        process.env.FRONTEND_URL
      }/auth/verify-email/callback?verificationToken=${encodeURIComponent(
        verificationToken
      )}&userId=${encodeURIComponent(newUser._id.toString())}`,
    };

    sendEmail(mailOptions);

    await newUser.save();
    return void res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email to verify your account before logging in.",
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
    if (!verifiedTokenUser) {
      return void res.status(404).json({
        success: false,
        message: "User not exists",
        errors: {},
      });
    }
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
          "Your verification link may have expired or is invalid. Please get a new one.",
        errors: {
          verifiedToken: "Invalid",
        },
      });
    }

    verifiedTokenUser.isEmailVerified = true;
    verifiedTokenUser.verificationToken = null;
    await verifiedTokenUser.save();

    return void res.status(200).json({
      success: true,
      message: "Verify email successfully, Please log in",
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

const loginUserByEmailSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string(),
});
export async function loginUserByEmail(req: Request, res: Response) {
  const data = req.body;
  try {
    const { email, password } = loginUserByEmailSchema.parse(data);
    const loginUser = await User.findOne({ email });
    if (!loginUser) {
      return void res.status(404).json({
        success: false,
        message: "No account found with this email.",
        errors: { email: "Email does not exist." },
      });
    }
    if (!loginUser.isEmailVerified) {
      return void res.status(401).json({
        success: false,
        message:
          "Your email is not verified. Please check your inbox for the verification link.",
        errors: {},
      });
    }

    if (!compareSync(password, loginUser.password)) {
      return void res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
        errors: { password: "Invalid password." },
      });
    } else {
      req.session.regenerate(function (err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error regenerating session token",
            errors: {},
          });
        }
        req.session.userId = loginUser._id;
        req.session.save(function (err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Error saving session",
              errors: {},
            });
          }
          return void res.status(200).json({
            success: true,
            message: "Logged in successfully",
            errors: {},
          });
        });
      });
    }
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

export async function logoutUser(req: Request, res: Response) {
  if (!req.session.userId) {
    return void res.status(200).json({
      success: true,
      message: "You already logged out.",
      errors: {},
    });
  }
  req.session.userId = undefined;
  req.session.destroy((err) => {
    if (err)
      return void res.status(500).json({
        success: false,
        message: "Logged out failed!",
        errors: {},
      });
    res.clearCookie("connect.sid");
    return void res.status(200).json({
      success: true,
      message: "Logged out successfully!",
      errors: {},
    });
  });
}

const forgetPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});
export async function forgetPassword(req: Request, res: Response) {
  const data = req.body;
  try {
    const { email } = forgetPasswordSchema.parse(data);
    const forgetPasswordUser = await User.findOne({ email });

    if (!forgetPasswordUser) {
      return void res.status(404).json({
        success: false,
        message: "No account found with this email.",
        errors: { email: "Email does not exist." },
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiredDate = add(new Date(), { minutes: 10 });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Memories account Reset Password Link",
      text: `Hello, ${forgetPasswordUser.firstName} ${forgetPasswordUser.lastName} To reset your account password, follow this link: http://localhost:2000/api/auth/reset-password/${resetToken}/${forgetPasswordUser._id}`,
    };

    forgetPasswordUser.resetToken = resetToken;
    forgetPasswordUser.resetTokenExpiredDate = resetTokenExpiredDate;
    await forgetPasswordUser.save();

    sendEmail(mailOptions);

    return void res.status(200).json({
      success: true,
      message: "Reset password email sent successfully.",
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

const resetPassowrdSchema = z.object({
  resetToken: z.string(),
  userId: z.string(),
  newPassword: z.string().min(8, "Password must contain at least 8 characters"),
});
export async function resetPassowrd(req: Request, res: Response) {
  const data = { ...req.body, ...req.params };
  try {
    const { resetToken, userId, newPassword } = resetPassowrdSchema.parse(data);
    const resetPasswordUser = await User.findById(userId);
    if (!resetPasswordUser) {
      return void res.status(404).json({
        success: false,
        message: "User not found!",
        errors: {},
      });
    }
    if (
      resetPasswordUser.resetToken !== resetToken ||
      resetPasswordUser.resetTokenExpiredDate == null ||
      isPast(resetPasswordUser.resetTokenExpiredDate)
    ) {
      return void res.status(400).json({
        success: false,
        message:
          "Your reset link may have expired or invalid. Please try again the process",
        errors: {
          verifiedToken: "Invalid",
        },
      });
    }

    const salt = genSaltSync(12);
    const hashedPassword = hashSync(newPassword, salt);
    resetPasswordUser.password = hashedPassword;
    resetPasswordUser.resetToken = null;
    resetPasswordUser.resetTokenExpiredDate = null;
    await resetPasswordUser.save();

    return void res.status(200).json({
      success: true,
      message: "Reset password successfully",
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
export async function getUserProfile(req: Request, res: Response) {
  const { emails } = req.query;
  try {
    if (typeof emails === "string") {
      const emailList = emails.split(";");
      const usersList = await User.find(
        { email: { $in: emailList } },
        "firstName lastName email avatar -_id"
      );
      const emailOrderMap = emailList.reduce((acc, email, index) => {
        acc[email] = index;
        return acc;
      }, {} as Record<string, number>);
      usersList.sort((a, b) => emailOrderMap[a.email] - emailOrderMap[b.email]);
      return void res.status(200).json({
        success: true,
        message: "Fetch successfully",
        errors: {},
        data: usersList,
      });
    } else {
      return void res.status(500).json({
        success: false,
        message: "Something problem with search query on the server",
        errors: {},
      });
    }
  } catch (error) {
    return void res.status(500).json({
      success: false,
      message: "Internal server errors",
      errors: {},
    });
  }
}

// RESEND VERIFICATION EMAIL
// RESEND VERIFICATION EMAIL
// RESEND VERIFICATION EMAIL

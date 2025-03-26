import { z } from "zod";
import { Error } from "mongoose";
import { createTransport } from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

export function errorHandlers(error: any) {
  const errors: Record<string, string> = {};
  let message = "";

  if (error instanceof z.ZodError) {
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    message = "Zod validation errors occurred";
  } else if (error instanceof Error.ValidationError) {
    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });
    message = "Mongoose Schema validation errors occurred";
  } else {
    message = error.message || "Internal Server Error";
  }

  return { errors, message };
}

export function sendEmail(mailOptions: MailOptions) {
  const transporter = createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
}

import { z } from "zod";
import { Error } from "mongoose";

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
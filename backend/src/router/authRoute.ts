import { Router } from "express";
import {
  registerUserByEmail,
  verifyEmailCallback,
} from "../controller/authController";

const authRouter = Router();

authRouter.post("/registerUserByEmail", registerUserByEmail);
authRouter.get("/verify-email/:verificationToken/:userId", verifyEmailCallback);

export default authRouter;

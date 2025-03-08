import { Router } from "express";
import {
  isAuthenticatedTest,
  loginUserByEmail,
  registerUserByEmail,
  verifyEmailCallback,
} from "../controller/authController";

const authRouter = Router();

authRouter.post("/register-email", registerUserByEmail);
authRouter.get("/login-email", loginUserByEmail);
authRouter.get("/auth-status", isAuthenticatedTest);
authRouter.get("/verify-email/:verificationToken/:userId", verifyEmailCallback);

export default authRouter;

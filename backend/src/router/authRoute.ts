import { Router } from "express";
import {
  isAuthenticatedTest,
  loginUserByEmail,
  logoutUser,
  registerUserByEmail,
  verifyEmailCallback,
} from "../controller/authController";

const authRouter = Router();

authRouter.post("/register-email", registerUserByEmail);
authRouter.post("/login-email", loginUserByEmail);
authRouter.post("/logout", logoutUser);
authRouter.get("/auth-status", isAuthenticatedTest);
authRouter.get("/verify-email/:verificationToken/:userId", verifyEmailCallback);

export default authRouter;

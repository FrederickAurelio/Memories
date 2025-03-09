import { Router } from "express";
import {
  forgetPassword,
  isAuthenticatedTest,
  loginUserByEmail,
  logoutUser,
  registerUserByEmail,
  resetPassowrd,
  verifyEmailCallback,
} from "../controller/authController";

const authRouter = Router();

authRouter.post("/register-email", registerUserByEmail);
authRouter.post("/login-email", loginUserByEmail);
authRouter.post("/logout", logoutUser);
authRouter.post("/forget-password", forgetPassword);
authRouter.put("/reset-password/:resetToken/:userId", resetPassowrd);
authRouter.get("/auth-status", isAuthenticatedTest);
authRouter.get("/verify-email/:verificationToken/:userId", verifyEmailCallback);

export default authRouter;

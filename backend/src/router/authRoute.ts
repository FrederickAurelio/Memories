import { Router } from "express";
import {
  forgetPassword,
  getUserProfile,
  githubOauthAuthentication,
  isAuthenticated,
  loginUserByEmail,
  logoutUser,
  registerUserByEmail,
  resetPassowrd,
  sendEmailVerification,
  verifyEmailCallback,
} from "../controller/authController";

const authRouter = Router();

authRouter.post("/register-email", registerUserByEmail);
authRouter.post("/login-email", loginUserByEmail);
authRouter.post("/logout", logoutUser);
authRouter.post("/forget-password", forgetPassword);
authRouter.post("/resend-verification", sendEmailVerification);
authRouter.post("/sign-github", githubOauthAuthentication);
authRouter.put("/reset-password", resetPassowrd);
authRouter.get("/auth-status", isAuthenticated);
authRouter.get("/verify-email/:verificationToken/:userId", verifyEmailCallback);
authRouter.get("/users-profile", getUserProfile);

export default authRouter;

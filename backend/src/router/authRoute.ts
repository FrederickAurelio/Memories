import { Router } from "express";
import {
  isAuthenticatedTest,
  loginUserByEmail,
  registerUserByEmail,
  verifyEmailCallback,
} from "../controller/authController";

const authRouter = Router();

authRouter.post("/registerUserByEmail", registerUserByEmail);
authRouter.get("/loginUserByEmail", loginUserByEmail);
authRouter.get("/authStatus", isAuthenticatedTest);
authRouter.get("/verify-email/:verificationToken/:userId", verifyEmailCallback);

export default authRouter;

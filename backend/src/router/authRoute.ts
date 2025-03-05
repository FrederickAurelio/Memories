import { Router } from "express";
import { registerUserByEmail } from "../controller/authController";

const authRouter = Router();

authRouter.post("/registerUserByEmail", registerUserByEmail);

export default authRouter;

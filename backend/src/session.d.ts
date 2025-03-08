import session from "express-session";
import { Types } from "mongoose";

declare module "express-session" {
  export interface SessionData {
    userId?: Types.ObjectId;
  }
}

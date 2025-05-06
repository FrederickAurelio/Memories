import { Router } from "express";
import { saveCanva } from "../controller/camvaController";
import multer from "multer";
import path from "path";

import fs from "fs";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const finalExt = ext || `.${file.mimetype.split("/")[1]}`; // fallback
    cb(null, `${nameWithoutExt}${finalExt}`);
  },
});
const upload = multer({ storage });

const canvaRouter = Router();

canvaRouter.post(
  "/save-image",
  (req, res, next) => {
    if (!req.session.userId)
      return void res.status(401).json({
        success: false,
        message: `Not authorized!`,
        errors: {},
      });
    next();
  },
  upload.array("images"),
  (req, res, next) => {
    return void res.status(200).json({
      success: true,
      message: "Image saved successfully!",
      errors: {},
    });
  }
);

canvaRouter.post("/save", saveCanva);

export default canvaRouter;

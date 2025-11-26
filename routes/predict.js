import express from "express";
import multer from "multer";
import { predictTB } from "../controllers/tbController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ dest: "temp/" });

router.post("/", authMiddleware, upload.single("image"), predictTB);

export default router;

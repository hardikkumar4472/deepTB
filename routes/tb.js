
import express from "express";
import { predictTB } from "../controllers/tbController.js";
import { authMiddleware } from "../middleware/auth.js";
import { checkDuplicateResult } from "../middleware/duplicateResultCheck.js";
const router = express.Router();


router.post("/predict", authMiddleware,checkDuplicateResult ,predictTB);

export default router;

import express from "express";
import { signup, login, getProfile, sendOTP, verifyOTP } from "../controllers/authController.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", getProfile);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

export default router;

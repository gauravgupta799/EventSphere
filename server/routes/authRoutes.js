import express from "express";
import { registerUser, loginUser, verifyOTP } from "../controllers/authController.js";

const router = express.Router();

// Publis ROutes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);

// Protected Routes


export default router;
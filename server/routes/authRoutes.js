import express from "express";
import { registerUser, loginUser, verifyOTP } from "../controllers/authController.js";
import { isAdmin, verifyToken } from "../middleware/authProtector.js";

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);


export default router;
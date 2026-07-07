import express from "express";
import { createEvent, getAllEvents, getEvent, updateEvent, deleteEvent } from "../controllers/eventController.js";
import { verifyToken, isAdmin } from "../middleware/authProtector.js";

const router = express.Router();


router.get("/", getAllEvents);
router.get("/:id", getEvent);
router.post("/create", verifyToken, createEvent);
router.put("/update/:id", verifyToken, isAdmin, updateEvent);
router.delete("/delete/:id", verifyToken, isAdmin, deleteEvent);


export default router;
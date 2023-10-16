import express from "express";
import { eventController } from "../controllers/eventController";

const router = express.Router();

router.get("/", eventController.getAllEvents);
router.post("/", eventController.createEvent);
router.get("/:id", eventController.getEvent);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

export default router;

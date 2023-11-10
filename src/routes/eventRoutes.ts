import express from "express";
import { EventController } from "../controllers/eventController";
import { container } from "tsyringe";

const router = express.Router();
const eventController = container.resolve(EventController);

router.get("/", eventController.getAllEvents);
router.post("/", eventController.createEvent);
router.get("/:id", eventController.getEvent);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

export default router;

import { Request, Response } from "express";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { Event } from "../models/Event";

const dbPromise = open({
  filename: "src/db/database.sqlite",
  driver: sqlite3.Database,
});

export const eventController = {
  getAllEvents: async (req: Request, res: Response) => {
    const db = await dbPromise;
    const events = await db.all("SELECT * FROM events");
    res.json(events);
  },

  createEvent: async (req: Request, res: Response) => {
    const db = await dbPromise;
    const event: Event = req.body;

    if (
      !event.title ||
      !event.date ||
      !event.time ||
      !event.location ||
      !event.description
    ) {
      return res
        .status(400)
        .send("Propriedades obrigatórias ausentes no corpo da requisição.");
    }

    try {
      const result = await db.run(
        "INSERT INTO events (title, date, time, location, description) VALUES (?, ?, ?, ?, ?)",
        [event.title, event.date, event.time, event.location, event.description]
      );

      const lastId = result.lastID;

      const newEvent = await db.get("SELECT * FROM events WHERE id = ?", [
        lastId,
      ]);

      return res.status(201).json(newEvent);
    } catch (error) {
      console.error("Erro ao inserir evento:", error);
      return res.status(500).send("Erro interno ao criar evento.");
    }
  },

  getEvent: async (req: Request, res: Response) => {
    const db = await dbPromise;
    const event = await db.get("SELECT * FROM events WHERE id = ?", [
      req.params.id,
    ]);

    if (event) {
      res.json(event);
    } else {
      res.status(404).send("Event not found");
    }
  },

  updateEvent: async (req: Request, res: Response) => {
    const db = await dbPromise;
    const event: Event = req.body;

    await db.run(
      "UPDATE events SET title = ?, date = ?, time = ?, location = ?, description = ? WHERE id = ?",
      [
        event.title,
        event.date,
        event.time,
        event.location,
        event.description,
        req.params.id,
      ]
    );

    res.send("Event updated successfully");
  },

  deleteEvent: async (req: Request, res: Response) => {
    const db = await dbPromise;
    await db.run("DELETE FROM events WHERE id = ?", [req.params.id]);
    res.send("Event deleted successfully");
  },
};

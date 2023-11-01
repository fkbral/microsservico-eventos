import axios from "axios";
import { Request, Response } from "express";
import { Event } from "../models/Event";
import initializeDatabase from "../db/dbConfig";
import createError, { NotFound } from "http-errors";

const dbPromise = initializeDatabase();

// a lógica que é implementada dentro de um controller
export const getAllEventsHandler = async () => {
  const db = await dbPromise;
  const events = await db.all("SELECT * FROM events");
  return events;
};

export const getEventHandler = async (id: number) => {
  const db = await dbPromise;
  const event = await db.get("SELECT * FROM events WHERE id = ?", [id]);

  if (event) {
    return event;
  } else {
    throw createError.NotFound();
  }
};

export const eventController = {
  getAllEvents: async (req: Request, res: Response) => {
    const events = getAllEventsHandler();
    res.json(events);
  },

  createEvent: async (req: Request, res: Response) => {
    const db = await dbPromise;
    const event: Event = req.body;
    const usersServiceURL = process.env.USERS_SERVICE_URL;

    if (
      !event.title ||
      !event.date ||
      !event.time ||
      !event.location ||
      !event.description ||
      !event.guests
    ) {
      return res
        .status(400)
        .send("Propriedades obrigatórias ausentes no corpo da requisição.");
    }

    const guestsDetails = [];

    for (const userId of event.guests) {
      const handleUsersURL = `${usersServiceURL}/students/studentDetails/${userId}`;
      try {
        const userResponse = await axios.get(handleUsersURL);
        if (userResponse.status === 200) {
          guestsDetails.push(userResponse.data);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    }

    if (guestsDetails.length !== event.guests.length) {
      return res.status(400).send("Convidados fornecidos são inválidos.");
    }

    try {
      // Inserir novo evento.
      const result = await db.run(
        "INSERT INTO events (title, date, time, location, description) VALUES (?, ?, ?, ?, ?)",
        [event.title, event.date, event.time, event.location, event.description]
      );

      const lastId = result.lastID;

      // Associar convidados ao evento.
      const insertPromises = event.guests.map((userId) =>
        db.run("INSERT INTO event_guests (event_id, user_id) VALUES (?, ?)", [
          lastId,
          userId,
        ])
      );
      await Promise.all(insertPromises);

      const newEvent = await db.get("SELECT * FROM events WHERE id = ?", [
        lastId,
      ]);
      newEvent.guests = guestsDetails;

      return res.status(201).json(newEvent);
    } catch (error) {
      console.error("Erro ao inserir evento:", error);
      return res.status(500).send("Erro interno ao criar evento.");
    }
  },

  getGuestsForEvent: async (req: Request, res: Response) => {
    const eventId = req.params.eventId;
    const db = await dbPromise;

    try {
      const guests = await db.all(
        `
            SELECT u.id, u.name, u.email ... 
            FROM users u
            JOIN event_guests eg ON u.id = eg.user_id
            WHERE eg.event_id = ?
            `,
        [eventId]
      );

      return res.status(200).json(guests);
    } catch (error) {
      console.error("Erro ao buscar convidados:", error);
      return res.status(500).send("Erro interno ao buscar convidados.");
    }
  },

  getEvent: async (req: Request, res: Response) => {
    try {
      const event = getEventHandler(Number(req.params.id));

      res.json(event);
    } catch (error) {
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

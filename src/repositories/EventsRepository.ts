import { faker } from "@faker-js/faker";
import initializeDatabase from "../db/dbConfig";
import { Event } from "../models/Event";

export interface IEventsRepository {
  getEvent: () => {};
  createEvent: (event: Event) => Promise<Event>;
}

export class FakeEventsRepository implements IEventsRepository {
  private events: Event[] = [];
  async getEvent() {}
  async createEvent(event: Event): Promise<Event> {
    const newEvent = {
      ...event,
      id: faker.number.int({ min: 1, max: 2000 }),
      // id: Math.random(),
    };
    this.events.push(newEvent);
    return newEvent;
  }
}

export class EventsRepository implements IEventsRepository {
  async getEvent() {}
  async createEvent(event: Event): Promise<Event> {
    const dbPromise = initializeDatabase();
    const db = await dbPromise;
    await db.run(
      "INSERT INTO events (title, date, time, location, description) VALUES (?, ?, ?, ?, ?)",
      [event.title, event.date, event.time, event.location, event.description]
    );
    const newEvent = await db.get(
      "SELECT * FROM events ORDER BY id DESC LIMIT 1",
      [event.title, event.date, event.time, event.location, event.description]
    );

    return newEvent as Event;
  }
}

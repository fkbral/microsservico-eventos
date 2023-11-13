import "reflect-metadata";
import "../dependency_injection";
import { container } from "tsyringe";
import { describe, expect, test } from "vitest";
import { CreateEvent } from "./CreateEventUseCase";
import { Event } from "../models/Event";
import { faker } from "@faker-js/faker";
import { BadRequest } from "http-errors";

const makeGuestList = (length: number) => {
  return Array.from({ length }).map(() => faker.number.int());
};

describe("Create Event Use Case", () => {
  test("Deve retornar erro ao tentar criar um evento com título vazio", async () => {
    const createEvent = container.resolve(CreateEvent);
    const eventToCreate: Event = {
      title: "",
      date: new Date(),
      description: faker.lorem.paragraphs(),
      guests: [],
      location: faker.location.city(),
      time: "manhã",
    };

    expect(createEvent.execute(eventToCreate)).rejects.toBeInstanceOf(
      BadRequest
    );
  });

  test("Deve ser possível criar um evento válido", async () => {
    const createEvent = container.resolve(CreateEvent);
    const eventToCreate: Event = {
      title: faker.lorem.words(),
      date: new Date(),
      description: faker.lorem.paragraphs(),
      guests: [],
      location: faker.location.city(),
      time: "manhã",
    };

    const event = await createEvent.execute(eventToCreate);

    expect(event).toEqual(expect.objectContaining(eventToCreate));
  });

  test("Deve ser possível de criar um evento válido com lista de convidados", async () => {
    const createEvent = container.resolve(CreateEvent);
    const eventToCreate: Event = {
      title: faker.lorem.words(),
      date: new Date(),
      description: faker.lorem.paragraphs(),
      guests: makeGuestList(5),
      location: faker.location.city(),
      time: "manhã",
    };

    const event = await createEvent.execute(eventToCreate);

    expect(event).toEqual(expect.objectContaining(eventToCreate));
  });
});

import "reflect-metadata";
import "../dependency_injection";
import { test, expect, beforeEach, describe, vi } from "vitest";
import {
  createEventHandler,
  createEventHandlerWithInjection,
  getAllEventsHandler,
  getEventHandler,
  utils,
} from "./eventController";
import { Event } from "../models/Event";
import initializeDatabase from "../db/dbConfig";
import { NotFound } from "http-errors";
import { faker } from "@faker-js/faker";
import { FakeStudentsAndProfessionalsService } from "../services/FakeStudentsAndProfessionalsService";

vi.mock("axios", () => ({
  default: {
    get: async (_url: string) => ({
      status: 200,
      data: { id: faker.number.int() },
    }),
  },
}));

const makeEvent = async (event: Event) => {
  const db = await initializeDatabase();
  const id = event.id ?? faker.number.int();

  // insere o evento
  await db.run(
    "INSERT INTO events (id, title, date, time, location, description) VALUES (?, ?, ?, ?, ?, ?)",
    [id, event.title, event.date, event.time, event.location, event.description]
  );
};

beforeEach(async () => {
  // abrimos a conexão com o banco
  const dbPromise = initializeDatabase();

  // aguarda a conexão
  const db = await dbPromise;

  // deletar todos os eventos
  await db.run("DELETE FROM events");
});

// a descrição do teste (test) me ajuda a entender sobre o que será testado
// Estes de soma são exemplos de testes unitários
test("Testar se soma de 1 com 1 resulta em 2", () => {
  // o expect serve para comunicar qual deve ser o resultado do teste
  expect(1 + 1).toEqual(2);
});

test("Testar se NODE_ENV é igual a test", () => {
  // a extensão do vscode que instalamos para interagir com o vitest vai atribuir o valor test para nós
  // process.env.NODE_ENV = "test"
  expect(process.env.NODE_ENV).toEqual("test");
});

test("Testar se soma de 2 com 2 resulta em 4", () => {
  expect(2 + 2).toEqual(4);
});

// A partir deste ponto vamos fazer testes de integração
describe("Testes para handler de listagem de todos os eventos (getAllEvents)", () => {
  test("Testar se consigo listar um evento no sistema", async () => {
    // dados do evento
    const event: Event = {
      id: 1,
      title: "Casamento do meu primo",
      date: new Date(),
      description:
        "Evento de Casamento com amigos, família e muitos convidados",
      guests: [],
      location: "São Paulo",
      time: "Sexta-feira",
    };

    // insere o evento
    await makeEvent(event);

    // resgata eventos
    const allEvents = await getAllEventsHandler();

    // checa se array de eventos tem exatamete um item
    expect(allEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Casamento do meu primo",
          time: "Sexta-feira",
        }),
      ])
    );
  });

  test("Testar se consigo listar múltiplos eventos no sistema", async () => {
    const event1: Event = {
      title: "Corrida de kart",
      date: new Date(),
      description:
        "Evento de Casamento com amigos, família e muitos convidados",
      guests: [],
      location: "São Paulo",
      time: "Sexta-feira",
    };

    const event2: Event = {
      title: "Tosa do meu cachorro",
      date: new Date(),
      description:
        "Evento de Casamento com amigos, família e muitos convidados",
      guests: [],
      location: "São Paulo",
      time: "Quinta-feira",
    };

    // insere os eventos
    await makeEvent(event1);
    await makeEvent(event2);

    const allEvents = await getAllEventsHandler();

    expect(allEvents).toHaveLength(2);
    expect(allEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Corrida de kart" }),
        expect.objectContaining({ title: "Tosa do meu cachorro" }),
      ])
    );
  });
});

describe("Testes para handler de leitura de um evento (getEvent)", () => {
  test("Testar se dá erro quando busco por um evento inexistente", async () => {
    const idInexistente = -1;
    expect(getEventHandler(idInexistente)).rejects.toBeInstanceOf(NotFound);
  });

  test("Testar se conseguimos buscar por um evento válido", async () => {
    const title = faker.lorem.sentence();
    const description = faker.lorem.paragraph();

    // evento a ser inserido no banco
    const eventToCreate: Event = {
      id: faker.number.int(),
      title,
      description,
      date: faker.date.future(),
      guests: [faker.number.int(), faker.number.int()],
      location: "São Paulo",
      time: "Sexta-feira",
    };

    // aguardamos a criação do evento
    await makeEvent(eventToCreate);

    // pegamos o evento criado do banco
    const event = await getEventHandler(eventToCreate.id as number);

    // checamos se a data criada é maior do que a atual
    expect(Number(event.date)).greaterThan(Date.now());
    // checamos se o evento salvo no banco possui as mesmas propriedades
    expect(event).toEqual(
      expect.objectContaining({
        title,
        description,
      })
    );
  });
});

describe("Testes para handler de criação de um evento (createEvent)", async () => {
  test("Testar se é possível criar um evento válido (mock do método que busca dados no microsserviço de usuários)", async () => {
    const title = faker.lorem.sentence();
    const description = faker.lorem.paragraph();
    const guests = [faker.number.int(), faker.number.int()];

    // evento a ser inserido no banco
    const eventToCreate: Event = {
      id: faker.number.int(),
      title,
      description,
      date: faker.date.future(),
      guests,
      location: "São Paulo",
      time: "Sexta-feira",
    };

    const spy = vi.spyOn(utils, "getUserFromUserService");
    spy.mockImplementation(async (guestsDetails: any[], userId: number) => {
      guestsDetails.push(userId);
    });

    const event = await createEventHandler(eventToCreate);

    expect(event).toBeTruthy();
    expect(spy).toHaveBeenCalled();

    spy.mockReset();
  });

  test("Testar se é possível criar um evento válido usando serviço fake", async () => {
    const title = faker.lorem.sentence();
    const description = faker.lorem.paragraph();
    const guests = [faker.number.int(), faker.number.int()];

    // evento a ser inserido no banco
    const eventToCreate: Event = {
      id: faker.number.int(),
      title,
      description,
      date: faker.date.future(),
      guests,
      location: "São Paulo",
      time: "Sexta-feira",
    };

    const event = await createEventHandlerWithInjection(
      eventToCreate,
      new FakeStudentsAndProfessionalsService()
    );

    expect(event).toBeTruthy();
  });

  test("Testar se é possível criar um evento válido (mock do get do axios que busca dados no microsserviço de usuários)", async () => {
    const title = faker.lorem.sentence();
    const description = faker.lorem.paragraph();
    const guests = [faker.number.int(), faker.number.int()];

    // evento a ser inserido no banco
    const eventToCreate: Event = {
      id: faker.number.int(),
      title,
      description,
      date: faker.date.future(),
      guests,
      location: "São Paulo",
      time: "Sexta-feira",
    };

    const event = await createEventHandler(eventToCreate);

    expect(event).toBeTruthy();
  });
});

type UpdateGuestListHandlerInput = {
  eventId: string;
  guestsToAdd: number[];
  guestsToRemove: number[];
};

const updateGuestListHandler = async ({
  eventId,
  guestsToRemove,
  guestsToAdd,
}: UpdateGuestListHandlerInput) => {
  const dbPromise = initializeDatabase();
  const db = await dbPromise;
  const event = await db.get("SELECT * FROM events_guests WHERE event_id = ?", [
    eventId,
  ]);
};

describe("Testes para handler de atualização de convidados de um evento", async () => {
  test("Testar se é possível adicionar convidados em um evento existente", async () => {
    const title = faker.lorem.sentence();
    const description = faker.lorem.paragraph();
    const guests = [faker.number.int(), faker.number.int()];

    // evento a ser inserido no banco
    const eventToCreate: Event = {
      id: faker.number.int(),
      title,
      description,
      date: faker.date.future(),
      guests,
      location: "São Paulo",
      time: "Sexta-feira",
    };

    const spy = vi.spyOn(utils, "getUserFromUserService");
    spy.mockImplementation(async (guestsDetails: any[], userId: number) => {
      guestsDetails.push(userId);
    });

    const event = await createEventHandler(eventToCreate);
  });

  test("Testar se é possível remover convidados de um evento existente", async () => {
    const title = faker.lorem.sentence();
    const description = faker.lorem.paragraph();
    const guests = [faker.number.int(), faker.number.int()];

    // evento a ser inserido no banco
    const eventToCreate: Event = {
      id: faker.number.int(),
      title,
      description,
      date: faker.date.future(),
      guests,
      location: "São Paulo",
      time: "Sexta-feira",
    };

    const spy = vi.spyOn(utils, "getUserFromUserService");
    spy.mockImplementation(async (guestsDetails: any[], userId: number) => {
      guestsDetails.push(userId);
    });

    const event = await createEventHandler(eventToCreate);
  });
});

import { test, expect, beforeEach, describe } from "vitest";
import { getAllEventsHandler, getEventHandler } from "./eventController";
import { Event } from "../models/Event";
import initializeDatabase from "../db/dbConfig";
import { NotFound, BadRequest } from "http-errors";
import { faker } from "@faker-js/faker";

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

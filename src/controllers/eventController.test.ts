import { test, expect, beforeEach } from 'vitest'
import { getAllEventsHandler } from './eventController'
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Event } from '../models/Event';

beforeEach(async () => {
   // abrimos a conexão com o banco
   const dbPromise = open({
    filename: "src/db/database.sqlite",
    driver: sqlite3.Database,
  });

  // aguarda a conexão
  const db = await dbPromise;

  // deletar todos os eventos
  await db.run(
    "DELETE FROM events"
  );
})

// a descrição do teste (test) me ajuda a entender sobre o que será testado
// Estes de soma são exemplos de testes unitários
test('Testar se soma de 1 com 1 resulta em 2', () => {
  // o expect serve para comunicar qual deve ser o resultado do teste
  expect(1 + 1).toEqual(2)
})

test('Testar se soma de 2 com 2 resulta em 4', () => {
  expect(2 + 2).toEqual(4)
})

// A partir deste ponto vamos fazer testes de integração
test('Testar se consigo listar um evento no sistema', async () => {
  // abrimos a conexão com o banco
  const dbPromise = open({
    filename: "src/db/database.sqlite",
    driver: sqlite3.Database,
  });

  // aguarda a conexão
  const db = await dbPromise;

  // dados do evento
  const event: Event = {
    id: 1,
    title: 'Casamento do meu primo',
    date: new Date(),
    description: 'Evento de Casamento com amigos, família e muitos convidados',
    guests: [],
    location: 'São Paulo',
    time: 'Sexta-feira',
  }

  // insere o evento
  await db.run(
    "INSERT INTO events (title, date, time, location, description) VALUES (?, ?, ?, ?, ?)",
    [event.title, event.date, event.time, event.location, event.description]
  );

  // resgata eventos
  const allEvents = await getAllEventsHandler()

  // checa se array de eventos tem exatamete um item
  expect(allEvents).toHaveLength(1)
})

test('Testar se consigo listar múltiplos eventos no sistema', async () => {
  // abrimos a conexão com o banco
  const dbPromise = open({
    filename: "src/db/database.sqlite",
    driver: sqlite3.Database,
  });

  const db = await dbPromise;
  const event1: Event = {
    title: 'Corrida de kart',
    date: new Date(),
    description: 'Evento de Casamento com amigos, família e muitos convidados',
    guests: [],
    location: 'São Paulo',
    time: 'Sexta-feira',
  }

  const event2: Event = {
    title: 'Tosa do meu cachorro',
    date: new Date(),
    description: 'Evento de Casamento com amigos, família e muitos convidados',
    guests: [],
    location: 'São Paulo',
    time: 'Sexta-feira',
  }

  await db.run(
    "INSERT INTO events (title, date, time, location, description) VALUES (?, ?, ?, ?, ?)",
    [event1.title, event1.date, event1.time, event1.location, event1.description]
  );

  await db.run(
    "INSERT INTO events (title, date, time, location, description) VALUES (?, ?, ?, ?, ?)",
    [event2.title, event2.date, event2.time, event2.location, event2.description]
  );

  const allEvents = await getAllEventsHandler()

  expect(allEvents).toHaveLength(2)
  expect(allEvents).toEqual(
    expect.arrayContaining(
      [
        expect.objectContaining({title: 'Corrida de kart'}),
        expect.objectContaining({title: 'Tosa do meu cachorro'}),
      ]
    )
  )
})
// Importação dos módulos necessários
import axios from "axios";
import { Request, Response } from "express";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { Event } from "../models/Event";

// Configuração inicial da base de dados usando SQLite
const dbPromise = open({
  filename: "src/db/database.sqlite",
  driver: sqlite3.Database,
});

export const eventController = {
  // Função assíncrona para criar um novo evento
  createEvent: async (req: Request, res: Response) => {
    // Conexão com a base de dados
    const db = await dbPromise;

    // Dados do evento vindos do corpo da requisição
    const event: Event = req.body;

    // URL do microsserviço de usuários, definida em variáveis de ambiente
    const usersServiceURL = process.env.USERS_SERVICE_URL;

    // Verifica se todas as propriedades necessárias estão presentes
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

    // Loop para verificar e coletar detalhes dos convidados usando o microsserviço de usuários
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
  },
};

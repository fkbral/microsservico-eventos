import { inject, injectable } from "tsyringe";
import { Event } from "../models/Event";
import createHttpError from "http-errors";
import { IEventsRepository } from "../repositories/EventsRepository";

@injectable()
export class CreateEvent {
  constructor(
    @inject("UsersService")
    private userService: UserService,
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository
  ) {}

  async execute(event: Event) {
    if (
      !event.title ||
      !event.date ||
      !event.time ||
      !event.location ||
      !event.description ||
      !event.guests
    ) {
      throw createHttpError.BadRequest(
        "Propriedades obrigatórias ausentes no corpo da requisição."
      );
    }

    const guestsDetails: any[] = [];

    for (const userId of event.guests) {
      await this.userService.getStudents(guestsDetails, userId);
    }

    if (guestsDetails.length !== event.guests.length) {
      throw createHttpError.BadRequest("Convidados fornecidos são inválidos.");
    }

    try {
      // Inserir novo evento.
      const newEvent = await this.eventsRepository.createEvent(event);

      // Associar convidados ao evento.
      const insertPromises = event.guests.map((userId) =>
        this.eventsRepository.createEvent(event)
      );
      await Promise.all(insertPromises);

      return newEvent;
    } catch (error) {
      console.error("Erro ao inserir evento:", error);
      throw createHttpError.InternalServerError(
        "Erro interno ao criar evento."
      );
    }
  }
}

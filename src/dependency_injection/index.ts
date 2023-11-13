import { container } from "tsyringe";
import { StudentsAndProfessionalsService } from "../services/StudentsAndProfessionalsService";
import { FakeStudentsAndProfessionalsService } from "../services/FakeStudentsAndProfessionalsService";
import {
  EventsRepository,
  FakeEventsRepository,
} from "../repositories/EventsRepository";

const environment = process.env.NODE_ENV;

const registerUserService = () => {
  container.registerSingleton(
    "UsersService",
    environment === "test"
      ? FakeStudentsAndProfessionalsService
      : StudentsAndProfessionalsService
  );
};

const registerEventsRepository = () => {
  container.registerSingleton(
    "EventsRepository",
    environment === "test" ? FakeEventsRepository : EventsRepository
  );
};

registerUserService();
registerEventsRepository();

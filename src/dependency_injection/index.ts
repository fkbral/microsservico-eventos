import { container } from "tsyringe";
import { StudentsAndProfessionalsService } from "../services/StudentsAndProfessionalsService";
import { FakeStudentsAndProfessionalsService } from "../services/FakeStudentsAndProfessionalsService";

const environment = process.env.NODE_ENV;

const registerUserService = () => {
  container.registerSingleton(
    "UsersService",
    environment === "test"
      ? FakeStudentsAndProfessionalsService
      : StudentsAndProfessionalsService
  );
};

registerUserService();

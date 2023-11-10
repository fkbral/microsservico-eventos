import axios from "axios";

export class StudentsAndProfessionalsService {
  async getStudents(guestsDetails: any[], userId: number) {
    const usersServiceURL = process.env.USERS_SERVICE_URL;
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
}

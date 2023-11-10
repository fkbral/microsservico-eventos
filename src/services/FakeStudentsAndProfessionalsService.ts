export class FakeStudentsAndProfessionalsService {
  async getStudents(guestsDetails: any[], userId: number) {
    guestsDetails.push(userId);
  }
}

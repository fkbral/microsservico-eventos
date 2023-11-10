interface UserService {
  getStudents(guestsDetails: any[], userId: number): Promise<void>;
}

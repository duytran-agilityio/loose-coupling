import { MySQLUserRepository } from "./mysql.repository";

export class UserService {
  private userRepository: MySQLUserRepository;

  constructor() {
    // Hard dependency: Tight coupling
    this.userRepository = new MySQLUserRepository();
  }

  getById(id: number): string {
    return this.userRepository.getById(id);
  }
}

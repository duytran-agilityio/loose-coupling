class MySQLUserRepository {
  getById(id: number): string {
    return `User ${id} from MySQL`;
  }
}

class UserService {
  private userRepository: MySQLUserRepository;

  constructor() {
    // Hard dependency: Tight coupling
    this.userRepository = new MySQLUserRepository();
  }

  getById(id: number): string {
    return this.userRepository.getById(id);
  }
}

const userService = new UserService();
console.log(userService.getById(1));

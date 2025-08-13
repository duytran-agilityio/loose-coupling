class MySQLUserRepository {
  getById(id: number): string {
    return `User ${id} from MySQL`;
  }
}

class UserRepositoryFactory {
  static getUserRepository(): MySQLUserRepository {
    return new MySQLUserRepository();
  }
}

class UserService {
  private userRepository: MySQLUserRepository;

  constructor() {
    // IoC
    this.userRepository = UserRepositoryFactory.getUserRepository();
  }

  getById(id: number): string {
    return this.userRepository.getById(id);
  }
}

const userService = new UserService();
console.log(userService.getById(1));

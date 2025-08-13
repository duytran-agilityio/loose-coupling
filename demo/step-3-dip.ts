abstract class UserRepository {
  abstract getById(id: number): string;
}

class MySQLUserRepository implements UserRepository {
  getById(id: number): string {
    return `User ${id} from MySQL`;
  }
}

class UserRepositoryFactory {
  static getUserRepository(): UserRepository {
    return new MySQLUserRepository();
  }
}

class UserService {
  private userRepository: UserRepository;

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

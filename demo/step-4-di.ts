abstract class UserRepository {
  abstract getById(id: number): string;
}

class MySQLUserRepository implements UserRepository {
  getById(id: number): string {
    return `User ${id} from MySQL`;
  }
}

class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    // IoC
    this.userRepository = userRepository;
  }

  getById(id: number): string {
    return this.userRepository.getById(id);
  }
}

const userService = new UserService(new MySQLUserRepository());
console.log(userService.getById(1));

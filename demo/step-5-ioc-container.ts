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

enum IoCType {
  "class",
  "function",
}

type IocBinding = {
  type: IoCType;
  instance: any;
};

class SimpleIoCContainer {
  private bindings: Map<string, IocBinding> = new Map();

  // register
  bind(key: string, instance: IocBinding) {
    this.bindings.set(key, instance);
  }

  // get instance
  get<T>(key: string): T {
    const iocBinding = this.bindings.get(key);

    if (!iocBinding) {
      throw new Error(`Key ${key} is not exist`);
    }

    if (iocBinding.type === IoCType.function) {
      return iocBinding.instance();
    }

    return new iocBinding.instance();
  }
}

// init container
const constainer = new SimpleIoCContainer();

// register binding
constainer.bind("UserRepository", {
  type: IoCType.class,
  instance: MySQLUserRepository,
});
constainer.bind("UserService", {
  type: IoCType.function,
  instance: () => {
    const userRepository = constainer.get<UserRepository>("UserRepository");
    return new UserService(userRepository);
  },
});

const userService = constainer.get<UserService>("UserService");
console.log(userService.getById(1));

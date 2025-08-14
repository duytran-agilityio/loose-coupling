import { UserService } from "./src/user.service";

const userService = new UserService();
console.log(userService.getById(1));

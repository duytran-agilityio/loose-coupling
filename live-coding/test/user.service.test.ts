import { UserRepository } from "../src/user.repository";
import { UserService } from "../src/user.service";

describe("UserService", () => {
  it("should return user data from repository", () => {
    // Mock UserRepository
    const mockRepository: UserRepository = {
      getById: jest.fn().mockReturnValue("Mocked User 1"),
    };

    const userService = new UserService(mockRepository);
    const result = userService.getById(1);

    expect(result).toBe("Mocked User 1");
    expect(mockRepository.getById).toHaveBeenCalledWith(1);
  });
});

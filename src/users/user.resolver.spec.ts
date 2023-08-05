import {Test, TestingModule} from '@nestjs/testing';
import {UserResolver} from './user.resolver';
import {UserService} from './user.service';
import {Roles, UserEntity} from './user.entity';

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            updateById: jest.fn(),
            removeById: jest.fn(),
            isCreatorOrModerator: jest.fn().mockResolvedValue(true),
            findById: jest.fn(),
            findMany: jest.fn(),
          },
        },
      ],
    }).compile();

    userResolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  describe('updateUser', () => {
    it('should update a user and return the updated user', async () => {
      // Arrange
      const updateUserInput = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      const updatedUser = new UserEntity();
      updatedUser.id = 1;
      updatedUser.firstName = 'John';
      updatedUser.lastName = 'Doe';
      updatedUser.email = 'john.doe@example.com';

      const user2 = new UserEntity();
      user2.id = 2;
      user2.firstName = 'Jane';
      user2.lastName = 'Smith';
      user2.email = 'jane.smith@example.com';
      user2.role = Roles.Moderator;
      jest.spyOn(userService, 'updateById').mockResolvedValue(updatedUser);
      jest.spyOn(userService, 'isCreatorOrModerator').mockResolvedValue(true);
      // Act
      const result = await userResolver.updateUser(updateUserInput,user2);

      // Assert
      expect(userService.updateById).toHaveBeenCalledWith(updateUserInput);
      expect(result).toBe(updatedUser);
    });
  });

  describe('removeUser', () => {
    it('should remove a user and return the number of affected rows', async () => {
      // Arrange
      const id = 1; // Provide the necessary input for testing
      const affectedRows = 1; // Provide the expected number of affected rows
      const user2 = new UserEntity();
      user2.id = 1;
      user2.firstName = 'Jane';
      user2.lastName = 'Smith';
      user2.email = 'jane.smith@example.com';
      user2.role = Roles.Moderator;

      jest.spyOn(userService, 'removeById').mockResolvedValue(id);
      jest.spyOn(userService, 'isCreatorOrModerator').mockResolvedValue(true);

      // Act
      const result = await userResolver.removeUser(id,user2);

      // Assert
      expect(userService.removeById).toHaveBeenCalledWith(id);
      expect(result).toBe(affectedRows);
    });
  });

  describe('getOneUser', () => {
    it('should retrieve a user by ID and return the user', async () => {
      // Arrange
      const id = 1; // Provide the necessary input for testing
      const user = new UserEntity();
      user.id = 1;
      user.firstName = 'John';
      user.lastName = 'Doe';
      user.email = 'john.doe@example.com';
      user.role = Roles.Writer;

      jest.spyOn(userService, 'findById').mockResolvedValue(user);

      // Act
      const result = await userResolver.getOneUser(id);

      // Assert
      expect(userService.findById).toHaveBeenCalledWith(id);
      expect(result).toBe(user);
    });
  });

  describe('getAllUsers', () => {
    it('should retrieve all users and return an array of users', async () => {
      // Arrange
      const user1 = new UserEntity();
      user1.id = 1;
      user1.firstName = 'John';
      user1.lastName = 'Doe';
      user1.email = 'john.doe@example.com';
      user1.role = Roles.Writer;

      const user2 = new UserEntity();
      user2.id = 2;
      user2.firstName = 'Jane';
      user2.lastName = 'Smith';
      user2.email = 'jane.smith@example.com';
      user2.role = Roles.Moderator;

      const expectedUsers = [user1, user2];

      jest.spyOn(userService, 'findMany').mockResolvedValue(expectedUsers);

      // Act
      const result = await userResolver.getAllUsers();

      // Assert
      expect(userService.findMany).toHaveBeenCalled();
      expect(result).toBe(expectedUsers);
    });
  });
});

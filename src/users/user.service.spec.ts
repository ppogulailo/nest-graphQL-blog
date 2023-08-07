import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles, UserEntity } from './user.entity';
import { UserService } from './user.service';
type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};
describe('UserService', () => {
  let service: UserService;
  const userRepositoryMock: MockType<Repository<UserEntity>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a new user', async () => {
      const userInput = {
        email: 'custom@gmail.com',
        firstName: 'string',
        lastName: 'string',
        password: 'string',
      };
      userRepositoryMock.save.mockReturnValue(userInput);
      const newUser = await service.create(userInput);
      expect(newUser).toMatchObject(userInput);
      expect(userRepositoryMock.save).toHaveBeenCalledWith(userInput);
    });
  });
  describe('findAll', () => {
    it('should find all customers', async () => {
      const users = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@email.com',
          firstName: 'firstName',
          lastName: 'lastName',
          role: Roles.Moderator,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 2,
          name: 'John Ford',
          email: 'john.ford@email.com',
          firstName: 'firstName',
          lastName: 'lastName',
          role: Roles.Moderator,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      userRepositoryMock.find.mockReturnValue(users);
      const foundUsers = await service.findMany();
      expect(foundUsers).toEqual(users);
      expect(userRepositoryMock.find).toHaveBeenCalled();
    });
  });
  describe('findOne', () => {
    it('should find a customer', async () => {
      const user = {
        id: 2,
        name: 'John Ford',
        email: 'john.ford@email.com',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Moderator,
        createdAt: new Date(),
        updatedAt: new Date(),
        blogs:[],
        blogPost:[]
      };
      userRepositoryMock.findOne.mockReturnValue(user);
      const foundUser = await service.findById(user.id);
      expect(foundUser).toMatchObject(user);
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        relations: ['blog', 'blogPost'],
        where: { id: user.id },
      });
    });
  });
});

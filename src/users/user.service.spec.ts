import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles, UserEntity } from './user.entity';
import { UserService } from './user.service';
import { Field } from '@nestjs/graphql';
type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};
describe('UserService', () => {
  let service: UserService;
  const customerRepositoryMock: MockType<Repository<UserEntity>> = {
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
          useValue: customerRepositoryMock,
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
      const customerDTO = {
        email: 'custom@gmail.com',
        firstName: 'string',
        lastName: 'string',
        password: 'string',
      };
      customerRepositoryMock.save.mockReturnValue(customerDTO);
      const newCustomer = await service.create(customerDTO);
      expect(newCustomer).toMatchObject(customerDTO);
      expect(customerRepositoryMock.save).toHaveBeenCalledWith(customerDTO);
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
      customerRepositoryMock.find.mockReturnValue(users);
      const foundCustomers = await service.findMany();
      expect(foundCustomers).toContainEqual({
        id: 1,
        name: 'John Doe',
        email: 'john.doe@email.com',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Moderator,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(customerRepositoryMock.find).toHaveBeenCalled();
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
      };
      customerRepositoryMock.findOne.mockReturnValue(user);
      const foundCustomer = await service.findById(user.id);
      expect(foundCustomer).toMatchObject(user);
      expect(customerRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: user.id },
      });
    });
  });
});

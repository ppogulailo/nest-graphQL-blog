import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from '../auth/auth.service';
import { Roles, UserEntity } from '../users/user.entity';
import { LoginResponse } from './response/login.response';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};
describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;
  const userRepositoryMock: MockType<Repository<UserEntity>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        AuthService,
        UserService,
        JwtService,
        ConfigService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });
  describe('login', () => {
    it('should call authService.signIn with the provided login and return the result', async () => {
      const login = {
        email: 'test@example.com',
        password: 'testpassword',
      };
      const expectedResult: LoginResponse = {
        access_token: 'string',
        refresh_token: 'string',
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'firstName',
          lastName: 'lastName',
          role: Roles.Moderator,
          password: 'testpassword',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      // Mock the authService.signIn method
      jest.spyOn(authService, 'signIn').mockResolvedValue(expectedResult);

      // Execute the resolver method
      const result = await resolver.login(login);

      // Assert the result
      expect(result).toBe(expectedResult);

      // Assert that the authService.signIn method was called with the correct parameters
      expect(authService.signIn).toHaveBeenCalledWith(login);
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshTokens with the provided tokens and return the result', async () => {
      // Mock data
      const tokens = {
        refresh_token: 'string',
        access_token: 'string',
        id: 1,
      };
      const expectedResult = {
        refresh_token: 'string',
        access_token: 'string',
        id: 1,
      };

      // Mock the authService.refreshTokens method
      jest
        .spyOn(authService, 'refreshTokens')
        .mockResolvedValue(expectedResult);

      // Execute the resolver method
      const result = await resolver.refreshToken(tokens);

      // Assert the result
      expect(result).toBe(expectedResult);

      // Assert that the authService.refreshTokens method was called with the correct parameters
      expect(authService.refreshTokens).toHaveBeenCalledWith(
        tokens.id,
        tokens.refresh_token,
      );
    });
  });
});

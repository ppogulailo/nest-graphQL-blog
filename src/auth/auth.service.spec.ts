import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../users/user.service';
import { Roles, UserEntity } from '../users/user.entity';
import { AuthService } from './auth.service';
import { BlogEntity } from '../blog/blog.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserInput } from '../users/inputs /create-user.input';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};
describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;
  const blogRepositoryMock: MockType<Repository<BlogEntity>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
  };
  const userRepositoryMock: MockType<Repository<UserEntity>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        ConfigService,
        {
          provide: getRepositoryToken(BlogEntity),
          useValue: blogRepositoryMock,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });
  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });
  describe('signUp', () => {
    it('should create a new user and return tokens', async () => {
      // Mock the necessary dependencies
      const userData: CreateUserInput = {
        email: 'test@example.com',
        password: 'testpassword',
        firstName: 'firstName',
        lastName: 'lastName',
      };
      const newUser: UserEntity = {
        id: 1,
        email: 'john.ford@email.com',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Moderator,
        password: 'sdsa',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';

      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(null);
      jest
        .spyOn(authService, 'hashData')
        .mockResolvedValueOnce('hashedPassword');
      jest.spyOn(userService, 'create').mockResolvedValueOnce(newUser);
      jest
        .spyOn(authService, 'getTokens')
        .mockResolvedValueOnce({ accessToken, refreshToken });
      jest.spyOn(authService, 'updateRefreshToken').mockResolvedValueOnce();

      const result = await authService.signUp(userData);

      expect(userService.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(authService.hashData).toHaveBeenCalledWith(userData.password);
      expect(userService.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashedPassword',
      });
      expect(authService.getTokens).toHaveBeenCalledWith(
        newUser.id,
        newUser.email,
      );
      expect(authService.updateRefreshToken).toHaveBeenCalledWith(
        newUser.id,
        refreshToken,
      );
      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken,
        user: newUser,
      });
    });

    it('should throw BadRequestException if user already exists', async () => {
      const userData: CreateUserInput = {
        email: 'test@example.com',
        password: 'testpassword',
        firstName: 'firstName',
        lastName: 'lastName',
      };
      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Moderator,
        password: 'testpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(authService.signUp(userData)).rejects.toThrowError(
        BadRequestException,
      );
      expect(userService.findByEmail).toHaveBeenCalledWith(userData.email);
    });
  });
  describe('signIn', () => {
    it('should sign in the user and return tokens', async () => {
      const data = {
        email: 'test@example.com',
        password: 'testpassword',
      };
      const user = {
        id: 1,
        email: 'test@example.com',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Moderator,
        password: 'testpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const accessToken = 'mockAccessToken';
      const refreshToken = 'mockRefreshToken';

      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(user);
      jest.spyOn(argon2, 'verify').mockResolvedValueOnce(true);
      jest
        .spyOn(authService, 'getTokens')
        .mockResolvedValueOnce({ accessToken, refreshToken });
      jest.spyOn(authService, 'updateRefreshToken').mockResolvedValueOnce();

      const result = await authService.signIn(data);

      expect(userService.findByEmail).toHaveBeenCalledWith(data.email);
      expect(argon2.verify).toHaveBeenCalledWith(user.password, data.password);
      expect(authService.getTokens).toHaveBeenCalledWith(user.id, user.email);
      expect(authService.updateRefreshToken).toHaveBeenCalledWith(
        user.id,
        refreshToken,
      );
      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken,
        user: user,
      });
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      const data = {
        email: 'test@example.com',
        password: 'testpassword',
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(null);

      await expect(authService.signIn(data)).rejects.toThrowError(
        UnauthorizedException,
      );
      expect(userService.findByEmail).toHaveBeenCalledWith(data.email);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const data = {
        email: 'test@example.com',
        password: 'testpassword',
      };
      const user = {
        id: 1,
        email: 'test@example.com',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Moderator,
        password: 'testpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(user);
      jest.spyOn(argon2, 'verify').mockResolvedValueOnce(false);

      await expect(authService.signIn(data)).rejects.toThrowError(
        UnauthorizedException,
      );
      expect(userService.findByEmail).toHaveBeenCalledWith(data.email);
      expect(argon2.verify).toHaveBeenCalledWith(user.password, data.password);
    });
  });
  describe('updateRefreshToken', () => {
    it('should update the refresh token for the user', async () => {
      const userId = 1;
      const refreshToken = 'refreshToken';
      const hashedRefreshToken = 'hashedRefreshToken';
      const user = {
        id: 1,
        email: 'test@example.com',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Moderator,
        password: 'testpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(argon2, 'hash').mockResolvedValueOnce(hashedRefreshToken);
      jest.spyOn(userService, 'updateById').mockResolvedValueOnce(user);

      await authService.updateRefreshToken(userId, refreshToken);

      expect(argon2.hash).toHaveBeenCalledWith(refreshToken);
      expect(userService.updateById).toHaveBeenCalledWith({
        id: userId,
        refreshToken: hashedRefreshToken,
      });
    });
  });
  describe('hashData', () => {
    it('should hash the data', async () => {
      const data = 'password';
      const hashedData = 'hashedPassword';

      jest.spyOn(argon2, 'hash').mockResolvedValueOnce(hashedData);

      const result = await authService.hashData(data);

      expect(argon2.hash).toHaveBeenCalledWith(data);
      expect(result).toBe(hashedData);
    });
  });

  describe('verifyUser', () => {
    it('should verify the user from the JWT token', async () => {
      const authToken = 'accessToken';
      const decodedToken = { id: 1, email: 'test@example.com' };
      const user: UserEntity = {
        id: 1,
        email: 'test@example.com',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Moderator,
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(decodedToken);

      const result = await authService.verifyUser(authToken);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith(authToken, {
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
      });
      expect(result).toEqual(decodedToken);
    });
  });

  describe('refreshTokens', () => {
    it('should refresh the tokens for the user', async () => {
      // Mock data
      const userId = 1;
      const refreshToken = 'refreshToken';
      const accessToken = 'accessToken';
      const newRefreshToken = 'newRefreshToken';

      // Mock user
      const user: UserEntity = {
        id: 1,
        email: 'test@example.com',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Moderator,
        password: 'password',
        refreshToken: 'hashedRefreshToken',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock function calls
      jest.spyOn(userService, 'findById').mockResolvedValueOnce(user);
      jest.spyOn(argon2, 'verify').mockResolvedValueOnce(true);
      jest.spyOn(authService, 'getTokens').mockResolvedValueOnce({
        accessToken,
        refreshToken: newRefreshToken,
      });

      // Execute the function
      const result = await authService.refreshTokens(userId, refreshToken);

      // Assertions
      expect(userService.findById).toHaveBeenCalledWith(userId);
      expect(argon2.verify).toHaveBeenCalledWith(
        user.refreshToken,
        refreshToken,
      );
      expect(authService.getTokens).toHaveBeenCalledWith(user.id, user.email);
      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: newRefreshToken,
        id: user.id,
      });
    });

    it('should throw ForbiddenException if the user is not found', async () => {
      // Mock data
      const userId = 1;
      const refreshToken = 'refreshToken';

      // Mock function call
      jest.spyOn(userService, 'findById').mockResolvedValueOnce(null);

      // Execute the function and assert that it throws ForbiddenException
      await expect(
        authService.refreshTokens(userId, refreshToken),
      ).rejects.toThrow(ForbiddenException);

      // Assert that the function calls were made correctly
      expect(userService.findById).toHaveBeenCalledWith(userId);
    });
    it('should throw ForbiddenException if the refresh token does not match', async () => {
      // Mock data
      const userId = 1;
      const refreshToken = 'refreshToken';

      // Mock user
      const user: UserEntity = {
        id: 1,
        email: 'test@example.com',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Moderator,
        password: 'password',
        refreshToken: 'hashedRefreshToken',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock function calls
      jest.spyOn(userService, 'findById').mockResolvedValueOnce(user);
      jest.spyOn(argon2, 'verify').mockResolvedValueOnce(false);

      // Execute the function and assert that it throws ForbiddenException
      await expect(
        authService.refreshTokens(userId, refreshToken),
      ).rejects.toThrow(ForbiddenException);

      // Assert that the function calls were made correctly
      expect(userService.findById).toHaveBeenCalledWith(userId);
      expect(argon2.verify).toHaveBeenCalledWith(
        user.refreshToken,
        refreshToken,
      );
    });
  });
  describe('getTokens', () => {
    it('should return access and refresh tokens', async () => {
      // Mock data
      const userId = 1;
      const email = 'test@example.com';
      const accessToken = 'accessToken';
      const refreshToken = 'refreshToken';

      // Mock function calls
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(accessToken);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(refreshToken);
      jest.spyOn(configService, 'get').mockReturnValueOnce('JWT_ACCESS_SECRET');
      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('JWT_REFRESH_SECRET');

      // Execute the function
      const result = await authService.getTokens(userId, email);

      // Assert the result
      expect(result).toEqual({
        accessToken,
        refreshToken,
      });

      // Assert that the function calls were made correctly
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(
        1,
        { id: userId, email },
        { secret: 'JWT_ACCESS_SECRET', expiresIn: '3d' },
      );
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        { id: userId, email },
        { secret: 'JWT_REFRESH_SECRET', expiresIn: '30d' },
      );
      expect(configService.get).toHaveBeenNthCalledWith(1, 'JWT_ACCESS_SECRET');
      expect(configService.get).toHaveBeenNthCalledWith(
        2,
        'JWT_REFRESH_SECRET',
      );
    });
  });
});

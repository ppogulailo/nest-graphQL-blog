import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/users/user.service';
import { UserEntity } from 'src/users/user.entity';
import { LoginInput } from './inputs/login.input';
import { CreateUserInput } from '../users/inputs /create-user.input';
import { LoginResponse } from './dto/login.response';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(userData: CreateUserInput): Promise<LoginResponse> {
    console.log(userData, 'userDatta');
    const userExists = await this.usersService.getOneWhereEmail(userData.email);
    if (userExists) {
      throw new BadRequestException('User is already exist!');
    }

    // Hash password
    const hash = await this.hashData(userData.password);
    const newUser = await this.usersService.createUser({
      ...userData,
      password: hash,
    });

    const token = await this.getToken(newUser.id, newUser.email);
    console.log(token);
    return {
      access_token: token,
      user: newUser,
    };
  }

  async signIn(data: LoginInput): Promise<LoginResponse> {
    console.log(data);
    // Check if user exists
    const user = await this.usersService.getOneWhereEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    console.log(user);
    console.log(data.password);
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('password is wrong!');
    }
    const token = await this.getToken(user.id, user.email);
    return {
      access_token: token,
      user: user,
    };
  }

  async hashData(data: string): Promise<string> {
    return argon2.hash(data);
  }

  async verifyUser(authToken): Promise<UserEntity> {
    const verify = await this.jwtService.verifyAsync(authToken, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
    return verify;
  }

  async getToken(userId: number, email: string): Promise<string> {
    return this.jwtService.signAsync(
      {
        id: userId,
        email,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '5d',
      },
    );
  }
}

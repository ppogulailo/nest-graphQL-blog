import {
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import {
  Args,
  Context,
  GraphQLExecutionContext,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { CreateUserInput } from '../users/inputs /create-user.input';
import { LoginInput } from './inputs/login.input';
import { LoginResponse, RefreshResponse } from './dto/login.response';
import { RefreshInput } from './inputs/refresh.input';
import { CustomAuthGuard } from './guards/accessToken.guard';

@Resolver('auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async signup(
    @Context() context: GraphQLExecutionContext,
    @Args('createUserDto') createUserDto: CreateUserInput,
  ): Promise<LoginResponse> {
    return this.authService.signUp(createUserDto);
  }

  @Mutation(() => LoginResponse)
  async login(@Args('login') login: LoginInput): Promise<LoginResponse> {
    return await this.authService.signIn(login);
  }
  @UseGuards(CustomAuthGuard)
  @Mutation(() => LoginResponse)
  async refreshToken(
    @Args('refresh') tokens: RefreshInput,
  ): Promise<RefreshResponse> {
    return await this.authService.refreshTokens(
      tokens.id,
      tokens.refresh_token,
    );
  }
}

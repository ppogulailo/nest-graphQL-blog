import { Controller, Body, Post, Res, HttpCode } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Response } from 'express';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserEntity } from '../users/user.entity';
import { CreateUserInput } from '../users/inputs /create-user.input';
import { LoginInput } from './inputs/login.input';
import { LoginResponse } from './dto/login.response';

@Resolver('auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async signup(
    @Args('createUserDto') createUserDto: CreateUserInput,
  ): Promise<LoginResponse> {
    return this.authService.signUp(createUserDto);
  }

  @Mutation(() => LoginResponse)
  async login(@Args('login') login: LoginInput): Promise<LoginResponse> {
    return await this.authService.signIn(login);
  }
}

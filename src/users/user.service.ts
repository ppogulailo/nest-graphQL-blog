import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './inputs /create-user.input';
import { UpdateUserInput } from './inputs /update-user.input';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserInput: CreateUserInput): Promise<UserEntity> {
    return await this.userRepository.save({ ...createUserInput });
  }

  async getOneUser(id: string) {
    return await this.userRepository.findOne({
      where: {
        userId: id,
      },
    });
  }

  async getOneWhereEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: {
        userId: true,
        password: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async removeUser(id: string): Promise<string> {
    await this.userRepository.delete({ userId: id });
    return id;
  }

  async updateUser(updateUserInput: UpdateUserInput): Promise<UserEntity> {
    await this.userRepository.update(
      { userId: updateUserInput.id },
      { ...updateUserInput },
    );
    return await this.getOneUser(updateUserInput.id);
  }
}

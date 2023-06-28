import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateUserInput } from './inputs /create-user.input';
import { UpdateUserInput } from './inputs /update-user.input';
import { UserEntity } from './user.entity';
import {UserService} from "./user.service";



@Resolver('User')
export class UserResolver {
    constructor(
        private readonly userService: UserService,
    ) {
    }
    @Mutation(() => UserEntity)
    async updateUser(@Args('updateUser') updateUserInput: UpdateUserInput): Promise<UserEntity> {
        return await this.userService.updateUser(updateUserInput)
    }

    @Mutation(() => Number)
    async removeUser(@Args('id') id: number): Promise<number> {
        return await this.userService.removeUser(id)
    }

    @Query(() => UserEntity)
    async getOneUser(@Args('id') id: number): Promise<UserEntity> {
        console.log(id)
        return await this.userService.getOneUser(id)
    }

    @Query(() => [ UserEntity ])
    async getAllUsers(): Promise<UserEntity[]> {
        return await this.userService.getAllUsers()
    }
}

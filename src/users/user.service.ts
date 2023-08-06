import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateUserInput} from './inputs /create-user.input';
import {UpdateUserInput} from './inputs /update-user.input';
import {Roles, UserEntity} from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {
    }

    async getCount(): Promise<number> {
        const count = await this.userRepository.count()
        return count
    }

    async isCreatorOrModerator(id: number, currentUser): Promise<boolean> {
        const user = await this.findById(id)
        if (currentUser.role === Roles.Moderator) return true; // allow Moderator to get make requests
        return user.id === currentUser.id;
    }

    async create(createUserInput: CreateUserInput): Promise<UserEntity> {
        return await this.userRepository.save({...createUserInput});
    }

    async findById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id: id,
            },
            relations: ['blogs', 'blogPost'],
        });
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: {
                email: email,
            },
            select: {
                id: true,
                password: true,
                createdAt: true,
                updatedAt: true,
                email: true,
                firstName: true,
                lastName: true,
            },
        });
    }

    async findMany(): Promise<UserEntity[]> {
        return await this.userRepository.find({
            relations: ['blogs', 'blogPost'], order: {
                createdAt: 'asc'
            },
        });
    }

    async removeById(id: number): Promise<number> {
        await this.userRepository.delete({id: id});
        return id;
    }

    async updateById(updateUserInput: UpdateUserInput): Promise<UserEntity> {
        await this.userRepository.update(
            {id: updateUserInput.id},
            {...updateUserInput},
        );
        return await this.findById(updateUserInput.id);
    }
}

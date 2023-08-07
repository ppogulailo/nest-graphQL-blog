import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, Like} from 'typeorm';
import {BlogEntity} from './blog.entity';
import {CreateBlogInput} from './inputs/create-blog.input';
import {UpdateBlogInput} from './inputs/update-blog.input';
import {FetchBlogInput} from './inputs/fetch-blog.input';
import {Roles, UserEntity} from "../users/user.entity";
import {BLOG_ALREADY_EXIST} from "./constant/blog.constant";

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(BlogEntity)
        private readonly blogRepository: Repository<BlogEntity>,
    ) {
    }

    async getCount(title): Promise<number> {
        const count = await this.blogRepository.count({
            where: {
                name: Like(`%${title}%`),
            },
        })
        return count
    }

    async isCreatorOrModerator(id: number, currentUser): Promise<boolean> {
        const {user} = await this.findById(id)
        if (currentUser.role === Roles.Moderator) return true; // allow Moderator to get make requests
        return user.id === currentUser.id;
    }

    async create(
        createBlogInput: CreateBlogInput,
        user: UserEntity,
    ): Promise<BlogEntity> {
        const existBlog = await this.blogRepository.findOne({
            where: {
                name: createBlogInput.name
            }
        })
        if (existBlog) {
            throw new HttpException(BLOG_ALREADY_EXIST, HttpStatus.CONFLICT)
        }
        const blog = this.blogRepository.create({...createBlogInput, user: user});
        return await this.blogRepository.save(blog);
    }

    async findById(id: number) {
        return await this.blogRepository.findOne({
            where: {
                id: id,
            },
            relations: ['user', 'blogPost'],
        });
    }

    async findMany({
                       take,
                       skip,
                       title,
                   }: FetchBlogInput): Promise<BlogEntity[]> {
        return await this.blogRepository.find({
            where: {
                name: Like(`%${title}%`),
            },
            order: {
                createdAt: 'asc'
            },
            relations: ['user', 'blogPost'],
            take: take,
            skip: skip,
        });
    }

    async removeById(id: number): Promise<number> {
        await this.blogRepository.delete({id: id});
        return id;
    }

    async updateById(updateBlogInput: UpdateBlogInput): Promise<BlogEntity> {
        await this.blogRepository.update(
            {id: updateBlogInput.id},
            {...updateBlogInput},
        );
        return await this.findById(updateBlogInput.id);
    }
}

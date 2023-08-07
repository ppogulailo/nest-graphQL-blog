import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Like, Repository} from 'typeorm';
import {BlogPostEntity} from './blog-post.entity';
import {CreateBlogPostInput} from './inputs/create-blog-post.input';
import {UpdateBlogPostInput} from './inputs/update-blog-post.input';
import {UserService} from '../users/user.service';
import {BlogService} from '../blog/blog.service';
import {FetchBlogPostInput} from './inputs/fetch-blog-post.input';
import {Roles, UserEntity} from "../users/user.entity";
import {BLOG_POST_ALREADY_EXIST} from "./constant/blog-post.constant";

@Injectable()
export class BlogPostService {
    constructor(
        @InjectRepository(BlogPostEntity)
        private readonly blogPostRepository: Repository<BlogPostEntity>,
        private readonly userService: UserService,
        private readonly blogService: BlogService,
    ) {
    }

    async isCreatorOrModerator(id: number, currentUser): Promise<boolean> {
        const {user} = await this.findById(id)
        if (currentUser.role === Roles.Moderator) return true; // allow Moderator to get make requests
        return user.id === currentUser.id;
    }

    async getCount(title): Promise<number> {
        const count = await this.blogPostRepository.count({
            where: {
                title: Like(`%${title}%`),
            },
        })
        return count
    }

    async create(
        createBlogPostInput: CreateBlogPostInput,
        user: UserEntity,
    ): Promise<BlogPostEntity> {
        const existBlogPost = await this.blogPostRepository.findOne({
            where: {
                title: createBlogPostInput.title
            }
        })
        if (existBlogPost) {
            throw new HttpException(BLOG_POST_ALREADY_EXIST, HttpStatus.CONFLICT)
        }
        const blog = await this.blogService.findById(createBlogPostInput.blogId);
        const blogPost = this.blogPostRepository.create({
            ...createBlogPostInput,
            user: user,
            blog: blog,
        });
        return await this.blogPostRepository.save(blogPost);
    }

    async findById(id: number) {
        return await this.blogPostRepository.findOne({
            relations: ['user', 'blog'],
            where: {
                id: id,
            },
        });
    }

    async findMany({
                       take,
                       skip,
                       title,
                   }: FetchBlogPostInput): Promise<BlogPostEntity[]> {
        return await this.blogPostRepository.find({
            where: {
                title: Like(`%${title}%`),
            },
            order: {
                createdAt: 'asc'
            },
            relations: ['user', 'blog'],
            take: take,
            skip: skip,
        });
    }

    async removeById(id: number): Promise<number> {
        await this.blogPostRepository.delete({id: id});
        return id;
    }

    async updateById(
        updateBlogInput: UpdateBlogPostInput,
    ): Promise<BlogPostEntity> {
        await this.blogPostRepository.update(
            {id: updateBlogInput.id},
            {...updateBlogInput},
        );
        return await this.findById(updateBlogInput.id);
    }
}

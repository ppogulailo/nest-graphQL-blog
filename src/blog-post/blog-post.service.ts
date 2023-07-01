import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from "typeorm";
import { BlogPostEntity } from './blog-post.entity';
import { CreateBlogPostInput } from './inputs/create-blog-post.input';
import { UpdateBlogPostInput } from './inputs/update-blog-post.input';
import { UserService } from '../users/user.service';
import { BlogService } from '../blog/blog.service';
import { FetchBlogPostInput } from './inputs/fetch-blog-post.input';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectRepository(BlogPostEntity)
    private readonly blogPostRepository: Repository<BlogPostEntity>,
    private readonly userService: UserService,
    private readonly blogService: BlogService,
  ) {}

  async create(
    createBlogPostInput: CreateBlogPostInput,
  ): Promise<BlogPostEntity> {
    const user = await this.userService.findById(createBlogPostInput.userId);
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
      relations: ['user'],
      where: {
        id: id,
      },
    });
  }

  async findMany({
    take,
    skip,
    title,
    dateSort,
    id,
  }: FetchBlogPostInput): Promise<BlogPostEntity[]> {
    return await this.blogPostRepository.find({
      where: {
        title: Like(`%${title}%`),
        blog: {
          id,
        },
      },
      order: {
        createdAt: dateSort,
      },
      relations: ['user', 'blog'],
      take: take,
      skip: skip,
    });
  }

  async removeById(id: number): Promise<number> {
    await this.blogPostRepository.delete({ id: id });
    return id;
  }

  async updateById(
    updateBlogInput: UpdateBlogPostInput,
  ): Promise<BlogPostEntity> {
    await this.blogPostRepository.update(
      { id: updateBlogInput.id },
      { ...updateBlogInput },
    );
    return await this.findById(updateBlogInput.id);
  }
}

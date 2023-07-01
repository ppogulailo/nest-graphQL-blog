import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPostEntity } from './blog-post.entity';
import { CreateBlogPostInput } from './inputs/create-blog-post.input';
import { UpdateBlogPostInput } from './inputs/update-blog-post.input';
import { UserService } from '../users/user.service';
import { BlogService } from '../blog/blog.service';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectRepository(BlogPostEntity)
    private readonly blogPostRepository: Repository<BlogPostEntity>,
    private readonly userService: UserService,
    private readonly blogService: BlogService,
  ) {}

  async createBlogPost(
    createBlogPostInput: CreateBlogPostInput,
  ): Promise<BlogPostEntity> {
    const user = await this.userService.getOneUser(createBlogPostInput.userId);
    const blog = await this.blogService.getOneBlog(createBlogPostInput.blogId);
    const blogPost = this.blogPostRepository.create({
      ...createBlogPostInput,
      user: user,
      blog: blog,
    });
    return await this.blogPostRepository.save(blogPost);
  }

  async getOneBlogPost(id: number) {
    return await this.blogPostRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async getAllBlogPosts(): Promise<BlogPostEntity[]> {
    return await this.blogPostRepository.find({ relations: ['user', 'blog'] });
  }

  async removeBlogPost(id: number): Promise<number> {
    await this.blogPostRepository.delete({ id: id });
    return id;
  }

  async updateBlogPost(
    updateBlogInput: UpdateBlogPostInput,
  ): Promise<BlogPostEntity> {
    await this.blogPostRepository.update(
      { id: updateBlogInput.id },
      { ...updateBlogInput },
    );
    return await this.getOneBlogPost(updateBlogInput.id);
  }
}

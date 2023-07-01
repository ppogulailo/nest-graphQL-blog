import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlogPostService } from './blog-post.service';
import { BlogPostEntity } from './blog-post.entity';
import { CreateBlogPostInput } from './inputs/create-blog-post.input';
import { UpdateBlogPostInput } from './inputs/update-blog-post.input';
import { IsPublic } from '../auth/decorators/public.decorator';

@Resolver('Blog-Post')
export class BlogPostResolver {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Mutation(() => BlogPostEntity)
  async createBlogPost(
    @Args('createBlogPost') createBlogInput: CreateBlogPostInput,
  ): Promise<BlogPostEntity> {
    return await this.blogPostService.createBlogPost(createBlogInput);
  }

  @Query(() => [BlogPostEntity])
  async getAllBlogPosts(): Promise<BlogPostEntity[]> {
    return await this.blogPostService.getAllBlogPosts();
  }

  @Mutation(() => BlogPostEntity)
  async updateBlogPost(
    @Args('updateBlogPost') updateBlogInput: UpdateBlogPostInput,
  ): Promise<BlogPostEntity> {
    return await this.blogPostService.updateBlogPost(updateBlogInput);
  }

  @Mutation(() => Number)
  async removeBlogPost(@Args('id') id: number): Promise<number> {
    return await this.blogPostService.removeBlogPost(id);
  }

  @Query(() => BlogPostEntity)
  async getOneBlockPost(@Args('id') id: number): Promise<BlogPostEntity> {
    return await this.blogPostService.getOneBlogPost(id);
  }
}

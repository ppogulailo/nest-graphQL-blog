import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlogPostService } from './blog-post.service';
import { BlogPostEntity } from './blog-post.entity';
import { CreateBlogPostInput } from './inputs/create-blog-post.input';
import { UpdateBlogPostInput } from './inputs/update-blog-post.input';
import { IsPublic } from '../auth/decorators/public.decorator';
import { HasRoles } from '../auth/decorators/roles.decorator';
import { Roles } from '../users/user.entity';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { IsCreatorGuard } from '../auth/guards/is-creator.guard';
import {
  CurrentService,
  ServiceType,
} from '../auth/decorators/services.decoratir';

@Resolver('Blog-Post')
export class BlogPostResolver {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Mutation(() => BlogPostEntity)
  async createBlogPost(
    @Args('createBlogPost') createBlogInput: CreateBlogPostInput,
  ): Promise<BlogPostEntity> {
    return await this.blogPostService.create(createBlogInput);
  }

  @Query(() => [BlogPostEntity])
  async getAllBlogPosts(): Promise<BlogPostEntity[]> {
    return await this.blogPostService.findMany();
  }
  @UseGuards(IsCreatorGuard)
  @CurrentService(ServiceType.blogPostService)
  @Mutation(() => BlogPostEntity)
  async updateBlogPost(
    @Args('updateBlogPost') updateBlogInput: UpdateBlogPostInput,
  ): Promise<BlogPostEntity> {
    return await this.blogPostService.updateById(updateBlogInput);
  }
  @UseGuards(IsCreatorGuard)
  @CurrentService(ServiceType.blogPostService)
  @Mutation(() => Number)
  async removeBlogPost(@Args('id') id: number): Promise<number> {
    return await this.blogPostService.removeById(id);
  }

  @Query(() => BlogPostEntity)
  async getOneBlockPost(@Args('id') id: number): Promise<BlogPostEntity> {
    return await this.blogPostService.findById(id);
  }
}

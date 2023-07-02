import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlogService } from './blog.service';
import { BlogEntity } from './blog.entity';
import { CreateBlogInput } from './inputs/create-blog.input';
import { UpdateBlogInput } from './inputs/update-blog.input';
import { UseGuards } from '@nestjs/common';
import { IsCreatorGuard } from '../common/guards/is-creator.guard';
import {
  CurrentService,
  ServiceType,
} from '../common/decorators/services.decoratir';
import { FetchBlogPostInput } from '../blog-post/inputs/fetch-blog-post.input';
import { FetchBlogInput } from './inputs/fetch-blog.input';
import { User } from '../common/decorators/user.decorator';
import { UserEntity } from '../users/user.entity';

@Resolver('Blog')
export class BlogResolver {
  constructor(private readonly blogService: BlogService) {}
  @Mutation(() => BlogEntity)
  async createBlog(
    @Args('createBlog') createBlogInput: CreateBlogInput,
    @User() user: UserEntity,
  ): Promise<BlogEntity> {
    return await this.blogService.create(createBlogInput, user.id);
  }

  @Query(() => [BlogEntity])
  async getAllBlogs(@Args() args: FetchBlogInput): Promise<BlogEntity[]> {
    return await this.blogService.findMany(args);
  }
  @UseGuards(IsCreatorGuard)
  @CurrentService(ServiceType.blogService)
  @Mutation(() => BlogEntity)
  async updateBlog(
    @Args('updateBlog') updateBlogInput: UpdateBlogInput,
  ): Promise<BlogEntity> {
    return await this.blogService.updateById(updateBlogInput);
  }
  @UseGuards(IsCreatorGuard)
  @CurrentService(ServiceType.blogService)
  @Mutation(() => Number)
  async removeUser(@Args('id') id: number): Promise<number> {
    return await this.blogService.removeById(id);
  }

  @Query(() => BlogEntity)
  async getOneUser(@Args('id') id: number): Promise<BlogEntity> {
    return await this.blogService.findById(id);
  }
}

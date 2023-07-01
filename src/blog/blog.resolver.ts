import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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

@Resolver('Blog')
export class BlogResolver {
  constructor(private readonly blogService: BlogService) {}
  @Mutation(() => BlogEntity)
  async createBlog(
    @Args('createBlog') createBlogInput: CreateBlogInput,
  ): Promise<BlogEntity> {
    return await this.blogService.create(createBlogInput);
  }

  @Query(() => [BlogEntity])
  async getAllBlogs(): Promise<BlogEntity[]> {
    return await this.blogService.findMany();
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

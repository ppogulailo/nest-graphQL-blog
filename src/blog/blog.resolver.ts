import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlogService } from './blog.service';
import { BlogEntity } from './blog.entity';
import { CreateBlogInput } from './inputs/create-blog.input';
import { UserEntity } from "../users/user.entity";
import { UpdateUserInput } from "../users/inputs /update-user.input";
import { UpdateBlogInput } from "./inputs/update-blog.input";

@Resolver('Blog')
export class BlogResolver {
  constructor(private readonly blogService: BlogService) {}
  @Mutation(() => BlogEntity)
  async createBlog(
    @Args('createBlog') createBlogInput: CreateBlogInput,
  ): Promise<BlogEntity> {
    return await this.blogService.createBlog(createBlogInput);
  }

  @Query(() => [BlogEntity])
  async getAllBlogs(): Promise<BlogEntity[]> {
    return await this.blogService.getAllBlogs();
  }
  @Mutation(() => BlogEntity)
  async updateBlog(
    @Args('updateBlog') updateBlogInput: UpdateBlogInput,
  ): Promise<BlogEntity> {
    return await this.blogService.updateBlog(updateBlogInput);
  }

  @Mutation(() => Number)
  async removeUser(@Args('id') id: number): Promise<number> {
    return await this.blogService.removeBlog(id);
  }

  @Query(() => BlogEntity)
  async getOneUser(@Args('id') id: number): Promise<BlogEntity> {
    return await this.blogService.getOneBlog(id);
  }
}

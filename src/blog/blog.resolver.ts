import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {BlogService} from './blog.service';
import {BlogEntity} from './blog.entity';
import {CreateBlogInput} from './inputs/create-blog.input';
import {UpdateBlogInput} from './inputs/update-blog.input';
import {ForbiddenException, ParseIntPipe} from '@nestjs/common';
import {FetchBlogInput} from './inputs/fetch-blog.input';
import {User} from '../common/decorators/user.decorator';
import {UserEntity} from '../users/user.entity';
import {NEED_TO_BE_MODERATOR_OR_CREATOR} from "../common/const/global";
@Resolver('Blog')
export class BlogResolver {
    constructor(private readonly blogService: BlogService) {
    }

    @Mutation(() => BlogEntity)
    async createBlog(
        @Args('createBlog') createBlogInput: CreateBlogInput,
        @User() user: UserEntity,
    ): Promise<BlogEntity> {
        return await this.blogService.create(createBlogInput, user.id);
    }

    @Query(() => Number, {name: 'countBLog'})
    async getCount(@Args() args: FetchBlogInput,): Promise<number> {
        return this.blogService.getCount(args.title)
    }

    @Query(() => [BlogEntity])
    async getAllBlogs(@Args() args: FetchBlogInput): Promise<BlogEntity[]> {
        return await this.blogService.findMany(args);
    }

    @Mutation(() => BlogEntity)
    async updateBlog(
        @Args('updateBlog') updateBlogInput: UpdateBlogInput,
        @User() user: UserEntity
    ): Promise<BlogEntity> {
        if (!await this.blogService.isCreatorOrModerator(updateBlogInput.id, user)) {
            throw new ForbiddenException(NEED_TO_BE_MODERATOR_OR_CREATOR)
        }
        return await this.blogService.updateById(updateBlogInput);
    }

    @Mutation(() => Number)
    async removeBlog(@Args('id', ParseIntPipe) id: number, @User() user: UserEntity): Promise<number> {

        if (!await this.blogService.isCreatorOrModerator(id, user)) {
            throw new ForbiddenException(NEED_TO_BE_MODERATOR_OR_CREATOR)
        }
        return await this.blogService.removeById(id);
    }

    @Query(() => BlogEntity)
    async getOneUser(@Args('id', ParseIntPipe) id: number): Promise<BlogEntity> {
        return await this.blogService.findById(id);
    }
}

import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {BlogPostService} from './blog-post.service';
import {BlogPostEntity} from './blog-post.entity';
import {CreateBlogPostInput} from './inputs/create-blog-post.input';
import {UpdateBlogPostInput} from './inputs/update-blog-post.input';
import {UserEntity} from '../users/user.entity';
import {ForbiddenException, ParseIntPipe} from '@nestjs/common';
import {FetchBlogPostInput} from './inputs/fetch-blog-post.input';
import {User} from '../common/decorators/user.decorator';
import {NEED_TO_BE_MODERATOR_OR_CREATOR} from "../common/const/global";
import {IsPublic} from "../common/decorators/public.decorator";

@Resolver('Blog-Post')
export class BlogPostResolver {
    constructor(private readonly blogPostService: BlogPostService) {
    }

    @Mutation(() => BlogPostEntity)
    async createBlogPost(
        @Args('createBlogPost') createBlogInput: CreateBlogPostInput,
        @User() user: UserEntity,
    ): Promise<BlogPostEntity> {
        return await this.blogPostService.create(createBlogInput, user);
    }
    @IsPublic()
    @Query(() => Number, {name: 'countBlogPost'})
    async getCount(@Args() args: FetchBlogPostInput): Promise<number> {
        return this.blogPostService.getCount(args.title)
    }
    @IsPublic()
    @Query(() => [BlogPostEntity])
    async getAllBlogPosts(
        @Args() args: FetchBlogPostInput,
    ): Promise<BlogPostEntity[]> {
        return await this.blogPostService.findMany(args);
    }

    @Mutation(() => BlogPostEntity)
    async updateBlogPost(
        @Args('updateBlogPost') updateBlogInput: UpdateBlogPostInput,
        @User() user: UserEntity
    ): Promise<BlogPostEntity> {
        if (!await this.blogPostService.isCreatorOrModerator(updateBlogInput.id, user)) {
            throw new ForbiddenException(NEED_TO_BE_MODERATOR_OR_CREATOR)
        }
        return await this.blogPostService.updateById(updateBlogInput);
    }

    @Mutation(() => Number)
    async removeBlogPost(@Args('id', ParseIntPipe) id: number, @User() user: UserEntity): Promise<number> {
        if (!await this.blogPostService.isCreatorOrModerator(id, user)) {
            throw new ForbiddenException(NEED_TO_BE_MODERATOR_OR_CREATOR)
        }
        return await this.blogPostService.removeById(id);
    }
    @IsPublic()
    @Query(() => BlogPostEntity)
    async getOneBlockPost(@Args('id', ParseIntPipe) id: number): Promise<BlogPostEntity> {
        return await this.blogPostService.findById(id);
    }
}

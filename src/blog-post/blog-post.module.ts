import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostService } from './blog-post.service';
import { BlogPostResolver } from './blog-post.resolver';
import { UserEntity } from '../users/user.entity';
import { UserService } from '../users/user.service';
import { BlogService } from '../blog/blog.service';
import { BlogEntity } from '../blog/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPostEntity, UserEntity, BlogEntity])],
  providers: [BlogPostService, BlogPostResolver, UserService, BlogService],
})
export class BlogPostModule {}

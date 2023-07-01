import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './blog.entity';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';
import { UserService } from '../users/user.service';
import { UserModule } from '../users/user.module';
import { UserEntity } from '../users/user.entity';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity, UserEntity])],
  providers: [BlogService, BlogResolver, UserService],
})
export class BlogModule {}

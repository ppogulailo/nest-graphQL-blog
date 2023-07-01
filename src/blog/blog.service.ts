import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { CreateBlogInput } from './inputs/create-blog.input';
import { UpdateBlogInput } from './inputs/update-blog.input';
import { UserService } from '../users/user.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    private readonly userService: UserService,
  ) {}

  async createBlog(createBlogInput: CreateBlogInput): Promise<BlogEntity> {
    console.log(createBlogInput);
    const user = await this.userService.getOneUser(createBlogInput.userId); // Замените 'userId' на поле, которое содержит идентификатор пользователя в createBlogInput
    console.log(user);
    const blog = this.blogRepository.create({ ...createBlogInput, user: user });
    console.log(blog)
    return await this.blogRepository.save(blog);
  }

  async getOneBlog(id: number) {
    return await this.blogRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async getAllBlogs(): Promise<BlogEntity[]> {
    return await this.blogRepository.find({ relations: ['user'] });
  }

  async removeBlog(id: number): Promise<number> {
    await this.blogRepository.delete({ id: id });
    return id;
  }

  async updateBlog(updateBlogInput: UpdateBlogInput): Promise<BlogEntity> {
    await this.blogRepository.update(
      { id: updateBlogInput.id },
      { ...updateBlogInput },
    );
    return await this.getOneBlog(updateBlogInput.id);
  }
}

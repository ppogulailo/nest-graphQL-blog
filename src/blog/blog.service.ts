import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Like } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { CreateBlogInput } from './inputs/create-blog.input';
import { UpdateBlogInput } from './inputs/update-blog.input';
import { UserService } from '../users/user.service';
import { FetchBlogInput } from './inputs/fetch-blog.input';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    private readonly userService: UserService,
  ) {}

  async create(createBlogInput: CreateBlogInput): Promise<BlogEntity> {
    const user = await this.userService.findById(createBlogInput.userId); // Замените 'userId' на поле, которое содержит идентификатор пользователя в createBlogInput
    const blog = this.blogRepository.create({ ...createBlogInput, user: user });
    return await this.blogRepository.save(blog);
  }

  async findById(id: number) {
    return await this.blogRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findMany({
    take,
    skip,
    title,
    dateSort,
    id,
  }: FetchBlogInput): Promise<BlogEntity[]> {
    return await this.blogRepository.find({
      where: {
        name: Like(`%${title}%`),
        id,
      },
      order: {
        createdAt: dateSort,
      },
      relations: ['user'],
      take: take,
      skip: skip,
    });
  }

  async removeById(id: number): Promise<number> {
    await this.blogRepository.delete({ id: id });
    return id;
  }

  async updateById(updateBlogInput: UpdateBlogInput): Promise<BlogEntity> {
    await this.blogRepository.update(
      { id: updateBlogInput.id },
      { ...updateBlogInput },
    );
    return await this.findById(updateBlogInput.id);
  }
}

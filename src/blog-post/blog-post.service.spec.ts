import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../users/user.service';
import { Roles, UserEntity } from '../users/user.entity';
import { BlogPostService } from './blog-post.service';
import { BlogPostEntity } from './blog-post.entity';
import { CreateBlogPostInput } from './inputs/create-blog-post.input';
import { BlogEntity } from '../blog/blog.entity';
import { BlogService } from '../blog/blog.service';
type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};
describe('BlogPostService', () => {
  let blogServicePost: BlogPostService;
  let blogService: BlogService;
  let userService: UserService;

  const blogPostRepositoryMock: MockType<Repository<BlogPostEntity>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
  };

  const blogRepositoryMock: MockType<Repository<BlogEntity>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
  };
  const userRepositoryMock: MockType<Repository<UserEntity>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogPostService,
        UserService,
        BlogService,
        {
          provide: getRepositoryToken(BlogPostEntity),
          useValue: blogPostRepositoryMock,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepositoryMock,
        },
        {
          provide: getRepositoryToken(BlogEntity),
          useValue: blogRepositoryMock,
        },
      ],
    }).compile();
    blogServicePost = module.get<BlogPostService>(BlogPostService);
    blogService = module.get<BlogService>(BlogService);
    userService = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(blogServicePost).toBeDefined();
    expect(userService).toBeDefined();
  });
  describe('create', () => {
    it('should create a new blogPost', async () => {
      const createBlogInput: CreateBlogPostInput = {
        title: 'Test Blog',
        blogId: 1,
        message: 'message',
      };

      const user: UserEntity = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        role: Roles.Moderator,
      };
      const blog: BlogEntity = {
        id: 1,
        name: 'Test Blog',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: user,
      };
      const createdBlogPost: BlogPostEntity = {
        id: 1,
        title: 'Test Blog',
        message: 'message',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: user,
        blog: blog,
      };
      blogPostRepositoryMock.save.mockReturnValue(createdBlogPost);
      const newBlog = await blogServicePost.create(createBlogInput, user);
      expect(newBlog).toMatchObject(createdBlogPost);
    });
  });
  describe('findAll', () => {
    it('should find all blogPosts', async () => {
      const user: UserEntity = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        role: Roles.Moderator,
      };
      const blog: BlogEntity = {
        id: 1,
        name: 'Test Blog',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: user,
      };
      const blogPosts: BlogPostEntity[] = [
        {
          title: 'any',
          message: 'any',
          id: 19,
          createdAt: new Date(),
          updatedAt: new Date(),
          blog: blog,
          user: user,
        },
        {
          title: 'any',
          message: 'any',
          id: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
          blog: blog,
          user: user,
        },
      ];
      blogPostRepositoryMock.find.mockReturnValue(blogPosts);
      const foundBlogs = await blogServicePost.findMany({
        title: '',
        take: 1,
        skip: 0,
      });

      const expectedCustomer: BlogPostEntity = {
        title: 'any',
        message: 'any',
        id: 19,
        blog: blog,
        user: user,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      expect(foundBlogs).toContainEqual(expectedCustomer);
    });
  });
  describe('findOne', () => {
    it('should find a blogPost', async () => {
      const user: UserEntity = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        role: Roles.Moderator,
      };
      const blog: BlogEntity = {
        id: 1,
        name: 'Test Blog',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: user,
      };
      const blogPost: BlogPostEntity = {
        id: 29,
        title: 'Test Blog',
        message: 'message',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: user,
        blog: blog,
      };
      blogPostRepositoryMock.findOne.mockReturnValue(blogPost);
      const foundBlog = await blogServicePost.findById(blogPost.id);
      expect(foundBlog).toMatchObject(blogPost);
      expect(blogPostRepositoryMock.findOne).toHaveBeenCalledWith({
        relations: ['user', 'blog'],
        where: { id: blogPost.id },
      });
    });
  });

});

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
  [P in keyof T]?: jest.Mock<{}>;
};
describe('BlogPostService', () => {
  let blogServicePost: BlogPostService;
  let blogService: BlogService;
  let userService: UserService;

  const customerRepositoryMockBlogPost: MockType<Repository<BlogPostEntity>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
  };

  const customerRepositoryMockBlog: MockType<Repository<BlogEntity>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
  };
  const customerRepositoryMockUser: MockType<Repository<UserEntity>> = {
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
          useValue: customerRepositoryMockBlogPost,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: customerRepositoryMockUser,
        },
        {
          provide: getRepositoryToken(BlogEntity),
          useValue: customerRepositoryMockBlog,
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
    it('should create a new user', async () => {
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
      customerRepositoryMockBlogPost.save.mockReturnValue(createdBlogPost);
      const newBlog = await blogServicePost.create(createBlogInput, user.id);
      expect(newBlog).toMatchObject(createdBlogPost);
    });
  });
  describe('findAll', () => {
    it('should find all customers', async () => {
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
      customerRepositoryMockBlogPost.find.mockReturnValue(blogPosts);
      const foundCustomers = await blogServicePost.findMany({
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

      expect(foundCustomers).toContainEqual(expectedCustomer);
    });
  });
  describe('findOne', () => {
    it('should find a blog', async () => {
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
      customerRepositoryMockBlogPost.findOne.mockReturnValue(blogPost);
      const foundCustomer = await blogServicePost.findById(blogPost.id);
      expect(foundCustomer).toMatchObject(blogPost);
      expect(customerRepositoryMockBlogPost.findOne).toHaveBeenCalledWith({
        relations: ['user', 'blog'],
        where: { id: blogPost.id },
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../users/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { Repository } from 'typeorm';
import { BlogPostService } from '../blog-post/blog-post.service';
import { BlogPostEntity } from '../blog-post/blog-post.entity';
import { BlogPostResolver } from './blog-post.resolver';
import { UpdateBlogPostInput } from './inputs/update-blog-post.input';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};
describe('BlogPostResolver', () => {
  let blogPostResolver: BlogPostResolver;
  let blogPostService: BlogPostService;
  const customerRepositoryMockUser: MockType<Repository<UserEntity>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };
  const customerRepositoryMockBlogPost: MockType<Repository<BlogPostEntity>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogPostResolver,
        UserService,
        BlogPostService,
        {
          provide: BlogPostService,
          useValue: {
            updateById: jest.fn(),
            removeById: jest.fn(),
            findById: jest.fn(),
            findMany: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: customerRepositoryMockUser,
        },
        {
          provide: getRepositoryToken(BlogPostEntity),
          useValue: customerRepositoryMockBlogPost,
        },
      ],
    }).compile();

    blogPostResolver = module.get<BlogPostResolver>(BlogPostResolver);
    blogPostService = module.get<BlogPostService>(BlogPostService);
  });

  describe('updateBlogPost', () => {
    it('should update a blogPost and return the updated blogPost', async () => {
      // Arrange
      const updateBlogPostInput: UpdateBlogPostInput = {
        id: 1,
        title: 'Blog1',
      };

      const updatedBlogPost = new BlogPostEntity();
      updatedBlogPost.id = 1;
      updatedBlogPost.title = 'Blog1';
      jest
        .spyOn(blogPostService, 'updateById')
        .mockResolvedValue(updatedBlogPost);

      // Act
      const result = await blogPostResolver.updateBlogPost(updateBlogPostInput);

      // Assert
      expect(blogPostService.updateById).toHaveBeenCalledWith(updatedBlogPost);
      expect(result).toBe(updatedBlogPost);
    });
  });

  describe('removeBlogPost', () => {
    it('should remove a blogPost and return the number of affected rows', async () => {
      // Arrange
      const id = 1; // Provide the necessary input for testing
      const affectedRows = 1; // Provide the expected number of affected rows

      jest.spyOn(blogPostService, 'removeById').mockResolvedValue(affectedRows);

      // Act
      const result = await blogPostResolver.removeBlogPost(id);

      // Assert
      expect(blogPostService.removeById).toHaveBeenCalledWith(id);
      expect(result).toBe(affectedRows);
    });
  });

  describe('getOneBlogPost', () => {
    it('should retrieve a blogPost by ID and return the user', async () => {
      // Arrange
      const id = 1; // Provide the necessary input for testing
      const blogPost = new BlogPostEntity();
      blogPost.id = 1;
      blogPost.title = 'Blog1';
      blogPost.message = 'value';
      jest.spyOn(blogPostService, 'findById').mockResolvedValue(blogPost);

      // Act
      const result = await blogPostResolver.getOneBlockPost(id);

      // Assert
      expect(blogPostService.findById).toHaveBeenCalledWith(id);
      expect(result).toBe(blogPost);
    });
  });

  describe('getAllBlogPost', () => {
    it('should retrieve all blogPosts and return an array of blogPosts', async () => {
      // Arrange
      const blogPost1 = new BlogPostEntity();
      blogPost1.id = 1;
      blogPost1.title = 'Blog1';
      blogPost1.message = 'Blog1';

      const blogPost2 = new BlogPostEntity();
      blogPost2.id = 2;
      blogPost2.title = 'Blog2';
      blogPost2.message = 'Blog2';
      const expectedUsers = [blogPost1, blogPost2];

      jest.spyOn(blogPostService, 'findMany').mockResolvedValue(expectedUsers);

      // Act
      const result = await blogPostResolver.getAllBlogPosts({
        take: 2,
        skip: 0,
        title: '',
      });

      // Assert
      expect(blogPostService.findMany).toHaveBeenCalled();
      expect(result).toBe(expectedUsers);
    });
  });
});

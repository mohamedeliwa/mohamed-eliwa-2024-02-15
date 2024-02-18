import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePostDto } from '../dtos/create.post.dto';
import { User, UserRole } from '../../users/entities/user.entity';

describe('PostsService', () => {
  let service: PostsService;

  let postsRepository: Repository<Post>;

  const post_repository_token = getRepositoryToken(Post);

  const user: User = {
    id: 1,
    username: 'username',
    password: 'password',
    role: UserRole.ADMIN,
  };

  const createPostDto: CreatePostDto = {
    title: 'post title',
    content: 'post conent',
  };

  const savedPost: Post = {
    ...createPostDto,
    id: 1,
    author: user,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: post_repository_token,
          useValue: {
            save: jest.fn(() => savedPost),
            findOneOrFail: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postsRepository = module.get<Repository<Post>>(post_repository_token);
  });

  describe('Create Post', () => {
    it('should call postsRespository.save with right arguments', async () => {
      await service.create(user, createPostDto);
      expect(postsRepository.save).toHaveBeenCalledWith({
        ...createPostDto,
        author: user,
      });
    });

    it('should return saved post', async () => {
      const returnedPost = await service.create(user, createPostDto);
      expect(returnedPost).toEqual(savedPost);
    });
  });
});

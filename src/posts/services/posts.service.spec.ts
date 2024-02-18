import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePostDto } from '../dtos/create.post.dto';
import { User, UserRole } from '../../users/entities/user.entity';
import { UpdatePostDto } from '../dtos/update.post.dto';

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

  const updatePostDto: UpdatePostDto = {
    title: 'updated post',
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
            findOneOrFail: jest.fn(() => savedPost),
            find: jest.fn(() => [savedPost, savedPost]),
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

  describe('Find One Post', () => {
    it('should call postsRespository.findOneOrFail with right arguments', async () => {
      await service.findOne(savedPost.id);
      expect(postsRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: savedPost.id },
        relations: ['author'],
      });
    });

    it('should return saved post', async () => {
      const returnedPost = await service.findOne(savedPost.id);
      expect(returnedPost).toEqual(savedPost);
    });
  });

  describe('Find All Post', () => {
    it('should call postsRespository.find with right arguments', async () => {
      await service.find();
      expect(postsRepository.find).toHaveBeenCalled();
    });

    it('should return saved post', async () => {
      const returnedPosts = await service.find();
      expect(returnedPosts).toEqual([savedPost, savedPost]);
    });
  });

  describe('Update Post', () => {
    it('should call service.isPostOwner with right arguments', async () => {
      jest
        .spyOn(service, 'isPostOwner')
        .mockImplementationOnce(() => Promise.resolve(true));

      await service.update(user, savedPost.id, updatePostDto);
      expect(service.isPostOwner).toHaveBeenCalled();
    });

    it('should call postsRespository.save with right arguments', async () => {
      jest
        .spyOn(service, 'isPostOwner')
        .mockImplementationOnce(() => Promise.resolve(true));

      await service.update(user, savedPost.id, updatePostDto);
      expect(postsRepository.save).toHaveBeenCalledWith({
        id: savedPost.id,
        ...updatePostDto,
      });
    });

    it('should return saved post', async () => {
      const returnedPosts = await service.update(
        user,
        savedPost.id,
        updatePostDto,
      );
      expect(returnedPosts).toEqual(savedPost);
    });
  });
});

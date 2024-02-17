import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create.post.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdatePostDto } from '../dtos/update.post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  /**
   * creates a new post
   * @param user - who will create the post
   * @param createPostDto post's data to be created
   * @returns the newly created post
   */
  async create(user: User, createPostDto: CreatePostDto): Promise<Post> {
    const post = new Post();
    post.author = user;
    post.title = createPostDto.title;
    post.content = createPostDto.content;

    return await this.postsRepository.save(post);
  }

  /**
   * finds a post by id
   * @param id - id of the post to find
   * @returns the found post
   */
  async findOne(id: number): Promise<Post> {
    return await this.postsRepository.findOneOrFail({
      where: { id },
      relations: ['author'],
    });
  }

  /**
   * finds and returns all created posts
   * @returns all posts
   */
  async find(): Promise<Post[]> {
    return await this.postsRepository.find();
  }

  /**
   * update a post by id
   * @param id - id of the post
   * @param updatePostDto - post data to be updated
   * @returns the updated post object
   */
  async update(
    user: User,
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    // ensuring the user is the post owner beforing updating
    const isPostOwner = await this.isPostOwner(user.id, id);
    if (!isPostOwner) {
      throw new UnauthorizedException();
    }

    const post = { id, ...updatePostDto };
    return await this.postsRepository.save(post);
  }

  /**
   * deletes a post by id
   * @param id - post's id
   * @returns the number of affected entities
   */
  async delete(user: User, id: number): Promise<number> {
    // ensuring the user is the post owner beforing deleting
    const isPostOwner = await this.isPostOwner(user.id, id);
    if (!isPostOwner) {
      throw new UnauthorizedException();
    }
    return (await this.postsRepository.delete({ id })).affected;
  }

  /**
   * checks if a user is a post owner or not
   * @param userId - user's id
   * @param postId - post's id
   * @returns true is the owner, false if not
   */
  async isPostOwner(userId: number, postId): Promise<boolean> {
    const post = await this.findOne(postId);
    return post.author.id === userId;
  }
}

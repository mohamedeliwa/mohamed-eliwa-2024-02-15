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
    return await this.postsRepository.findOneByOrFail({ id });
  }
}

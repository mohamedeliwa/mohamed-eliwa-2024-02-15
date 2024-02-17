import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create.post.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(user: User, createPostDto: CreatePostDto): Promise<Post> {
    const post = new Post();
    post.author = user;
    post.title = createPostDto.title;
    post.content = createPostDto.content;

    this.postsRepository.save(post);

    return post;
  }
}

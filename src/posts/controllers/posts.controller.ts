import {
  Body,
  Controller,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from '../dtos/create.post.dto';
import { PostsService } from '../services/posts.service';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Post as PostEntity } from '../entities/post.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Posts')
@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    whitelist: true,
    forbidUnknownValues: true,
  }),
)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Post()
  async createPost(
    @Request() req,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    const user = req.user as User;
    return await this.postsService.create(user, createPostDto);
  }
}

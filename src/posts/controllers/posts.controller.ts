import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from '../dtos/create.post.dto';
import { PostsService } from '../services/posts.service';
import { User, UserRole } from '../../users/entities/user.entity';
import { Post as PostEntity } from '../entities/post.entity';
import { Roles } from '../../auth/decorators/roles.decorator';
import { PostParamsDto } from '../dtos/post.params.dto';
import { UpdatePostDto } from '../dtos/update.post.dto';

@ApiTags('Posts')
@ApiBearerAuth()
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

  @Get()
  async find(): Promise<PostEntity[]> {
    return await this.postsService.find();
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of the post to be returned',
  })
  @Get(':id')
  async findOne(@Param() { id }: PostParamsDto): Promise<PostEntity> {
    return await this.postsService.findOne(id);
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of the post to be updated',
  })
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Patch(':id')
  async update(
    @Request() req,
    @Param() { id }: PostParamsDto,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    const user = req.user as User;
    return await this.postsService.update(user, id, updatePostDto);
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of the post to be deleted',
  })
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Delete(':id')
  async delete(
    @Request() req,
    @Param() { id }: PostParamsDto,
  ): Promise<number> {
    const user = req.user as User;
    return await this.postsService.delete(user, id);
  }
}

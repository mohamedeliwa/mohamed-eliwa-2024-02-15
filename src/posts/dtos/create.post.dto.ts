import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    type: String,
    required: true,
    minLength: 10,
    maxLength: 50,
    description: 'title of the post',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  title: string;

  @ApiProperty({
    type: String,
    required: true,
    minLength: 20,
    maxLength: 100,
    description: 'content of the post',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  @MaxLength(100)
  content: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    type: String,
    required: false,
    minLength: 10,
    maxLength: 50,
    description: 'title of the post',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  title?: string;

  @ApiProperty({
    type: String,
    required: false,
    minLength: 20,
    maxLength: 100,
    description: 'content of the post',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  @MaxLength(100)
  content?: string;
}

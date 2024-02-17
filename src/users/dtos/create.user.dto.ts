import {
  IsAlpha,
  IsIn,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    required: true,
    minLength: 8,
    maxLength: 50,
    description: 'username of the user',
  })
  @IsNotEmpty()
  @IsAlpha()
  @MinLength(8)
  @MaxLength(50)
  username: string;

  @ApiProperty({
    type: String,
    required: true,
    minLength: 8,
    maxLength: 50,
    description: 'password of the user',
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
  })
  @MaxLength(50)
  password: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'role of the user',
    enum: Object.values(UserRole),
  })
  @IsNotEmpty()
  @IsIn(Object.values(UserRole))
  role: UserRole;
}

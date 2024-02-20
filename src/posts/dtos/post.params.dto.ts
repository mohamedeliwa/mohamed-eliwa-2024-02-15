import { IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class PostParamsDto {
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  id?: number;
}

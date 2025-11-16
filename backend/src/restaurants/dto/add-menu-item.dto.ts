import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AddMenuItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  // Use Type() to convert incoming value to number
  @Type(() => Number)
  @IsNumber()
  price!: number;

  @IsOptional() @IsString() imageUrl?: string;
}

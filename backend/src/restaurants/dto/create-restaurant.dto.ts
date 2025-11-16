import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsOptional() @IsString() imageUrl?: string;
}

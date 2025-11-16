// src/orders/dto/create-order.dto.ts
import {
  ArrayMinSize,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  IsNumber,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  qty!: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'price must be a number' })
  price!: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  restaurantId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}

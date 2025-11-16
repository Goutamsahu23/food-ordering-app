import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePaymentDto {
  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  details!: string; // JSON string or masked card info
}

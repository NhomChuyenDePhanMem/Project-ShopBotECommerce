import { IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class AddOrderItemDto {
  @IsInt()
  @IsPositive()
  menuItemId: number;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  itemNote?: string;
}

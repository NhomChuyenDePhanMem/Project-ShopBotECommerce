import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateOrderItemDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  menuItemId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  itemNote?: string;
}

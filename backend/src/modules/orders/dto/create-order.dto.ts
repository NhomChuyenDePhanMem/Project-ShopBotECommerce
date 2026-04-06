import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

const ORDER_TYPES = ['dine_in', 'takeaway', 'delivery'] as const;

class CreateOrderItemDto {
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

export class CreateOrderDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  tableId?: number;

  @IsInt()
  @IsPositive()
  createdBy: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  customerName?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(ORDER_TYPES)
  orderType: (typeof ORDER_TYPES)[number];

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

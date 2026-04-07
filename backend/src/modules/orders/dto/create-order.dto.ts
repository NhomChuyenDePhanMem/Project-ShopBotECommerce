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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const ORDER_TYPES = ['shipping', 'pickup'] as const;

class CreateOrderItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiPropertyOptional({ example: 'Giao truoc 18h', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  itemNote?: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 5 })
  @IsInt()
  @IsPositive()
  createdBy: number;

  @ApiPropertyOptional({ example: 'Tran Thi B', maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  customerName?: string;

  @ApiProperty({ enum: ORDER_TYPES, example: 'shipping' })
  @IsString()
  @IsNotEmpty()
  @IsIn(ORDER_TYPES)
  orderType: (typeof ORDER_TYPES)[number];

  @ApiPropertyOptional({ example: 'Giao gio hanh chinh' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

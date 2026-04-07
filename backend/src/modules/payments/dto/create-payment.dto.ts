import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const METHODS = ['cod', 'vnpay', 'momo', 'stripe'] as const;
const STATUSES = ['success', 'failed', 'refunded'] as const;

export class CreatePaymentDto {
  @ApiProperty({ example: 101 })
  @IsInt()
  @IsPositive()
  orderId: number;

  @ApiProperty({ enum: METHODS, example: 'cod' })
  @IsString()
  @IsIn(METHODS)
  paymentMethod: (typeof METHODS)[number];

  @ApiProperty({ example: 250000 })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({ enum: STATUSES, example: 'success' })
  @IsOptional()
  @IsString()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number];

  @ApiPropertyOptional({ example: 'TXN-2026-0001', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  transactionRef?: string;
}

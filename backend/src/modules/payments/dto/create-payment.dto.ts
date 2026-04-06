import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

const METHODS = ['cash', 'card', 'transfer', 'e_wallet'] as const;
const STATUSES = ['success', 'failed', 'refunded'] as const;

export class CreatePaymentDto {
  @IsInt()
  @IsPositive()
  orderId: number;

  @IsString()
  @IsIn(METHODS)
  paymentMethod: (typeof METHODS)[number];

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  transactionRef?: string;
}

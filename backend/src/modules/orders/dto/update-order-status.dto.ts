import { IsIn, IsString } from 'class-validator';

const ORDER_STATUS = [
  'pending',
  'processing',
  'served',
  'paid',
  'cancelled',
] as const;

export class UpdateOrderStatusDto {
  @IsString()
  @IsIn(ORDER_STATUS)
  status: (typeof ORDER_STATUS)[number];
}

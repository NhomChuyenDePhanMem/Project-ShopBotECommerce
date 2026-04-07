import { IsIn, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const ORDER_STATUS = [
  'pending',
  'confirmed',
  'packing',
  'shipping',
  'done',
  'cancelled',
] as const;

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: ORDER_STATUS, example: 'confirmed' })
  @IsString()
  @IsIn(ORDER_STATUS)
  status: (typeof ORDER_STATUS)[number];
}

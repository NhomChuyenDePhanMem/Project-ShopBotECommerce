import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

const RESERVATION_STATUS = [
  'pending',
  'confirmed',
  'seated',
  'completed',
  'cancelled',
] as const;

export class UpdateReservationStatusDto {
  @ApiProperty({ enum: RESERVATION_STATUS, example: 'confirmed' })
  @IsString()
  @IsIn(RESERVATION_STATUS)
  status: (typeof RESERVATION_STATUS)[number];
}

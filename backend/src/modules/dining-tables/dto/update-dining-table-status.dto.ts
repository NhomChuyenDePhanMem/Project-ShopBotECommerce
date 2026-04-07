import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

const DINING_TABLE_STATUS = [
  'available',
  'reserved',
  'occupied',
  'inactive',
] as const;

export class UpdateDiningTableStatusDto {
  @ApiProperty({ enum: DINING_TABLE_STATUS, example: 'occupied' })
  @IsString()
  @IsIn(DINING_TABLE_STATUS)
  status: (typeof DINING_TABLE_STATUS)[number];
}

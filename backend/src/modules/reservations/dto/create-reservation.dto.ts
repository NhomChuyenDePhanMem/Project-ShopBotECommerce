import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateReservationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  tableId: number;

  @IsString()
  @Length(1, 120)
  customerName: string;

  @IsString()
  @Length(6, 20)
  customerPhone: string;

  @IsDateString()
  reservedTime: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  partySize: number;

  @IsOptional()
  @IsIn(['booked', 'checked_in', 'cancelled', 'completed'])
  status?: 'booked' | 'checked_in' | 'cancelled' | 'completed';
}

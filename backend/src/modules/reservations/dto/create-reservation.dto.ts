import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  tableId: number;

  @ApiProperty({ example: 'Nguyen Van C' })
  @IsString()
  @MaxLength(120)
  customerName: string;

  @ApiPropertyOptional({ example: '0909998888' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  @IsPositive()
  partySize: number;

  @ApiProperty({ example: '2026-04-08T19:00:00.000Z' })
  @IsDateString()
  reservedAt: string;

  @ApiPropertyOptional({ example: 'Sinh nhat gia dinh' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDiningTableDto {
  @ApiProperty({ example: 'T01' })
  @IsString()
  @MaxLength(40)
  code: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  @IsPositive()
  capacity: number;

  @ApiPropertyOptional({ example: 'Gan cua so' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

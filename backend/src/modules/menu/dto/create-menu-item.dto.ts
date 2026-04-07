import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  categoryId: number;

  @ApiProperty({ example: 'Pho bo dac biet' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ example: 'Them hanh, khong ngo' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 65000 })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

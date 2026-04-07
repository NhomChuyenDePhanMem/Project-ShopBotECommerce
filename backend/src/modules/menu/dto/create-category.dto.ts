import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Do uong' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}

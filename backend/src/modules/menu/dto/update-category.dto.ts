import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Mon khai vi' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}

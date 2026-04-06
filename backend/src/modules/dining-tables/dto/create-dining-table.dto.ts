import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateDiningTableDto {
  @IsString()
  @Length(1, 20)
  tableCode: string;

  @IsInt()
  @Min(1)
  @Max(20)
  capacity: number;

  @IsOptional()
  @IsIn(['available', 'occupied', 'reserved'])
  status?: 'available' | 'occupied' | 'reserved';
}

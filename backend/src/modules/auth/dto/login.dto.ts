import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'customer01' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'Customer@123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  password: string;
}

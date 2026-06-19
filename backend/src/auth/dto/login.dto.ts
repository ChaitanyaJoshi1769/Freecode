import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'User email or username' })
  @IsNotEmpty()
  @IsString()
  emailOrUsername: string;

  @ApiProperty({ description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

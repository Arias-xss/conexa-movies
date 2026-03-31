import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({ example: 'john_doe@example.com', format: 'email' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, maxLength: 20 })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}

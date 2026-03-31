import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Desired username for the account',
    example: 'john_doe',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  username: string;

  @ApiProperty({
    description: 'User email',
    example: 'john_doe@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (min 8 characters and max 20 characters)',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}

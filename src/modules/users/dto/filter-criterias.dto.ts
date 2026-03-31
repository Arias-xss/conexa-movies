import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { UserRoles } from '../entities/users.entity';

export class UniqueFilter {
  @ApiProperty({
    description: 'User unique ID',
    example: 1,
    format: 'int',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({
    description: 'User email',
    example: 'john_doe@example.com',
    format: 'email',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}

export class FindFilter {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Page number',
    default: 1,
  })
  page: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Limit quantity',
    default: 10,
  })
  limit: number;

  @IsOptional()
  @IsEnum(UserRoles)
  @ApiProperty({
    description: 'User roles list',
    required: false,
    enum: UserRoles,
  })
  role?: UserRoles;
}

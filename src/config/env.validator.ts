import { plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsString,
  validateSync,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  @IsNotEmpty()
  MARIADB_HOST: string;

  @IsNumber()
  MARIADB_PORT: number;

  @IsString()
  @IsNotEmpty()
  MARIADB_USER: string;

  @IsString()
  @IsNotEmpty()
  MARIADB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  MARIADB_DATABASE: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  MOVIES_BASE_URL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

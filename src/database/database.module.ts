import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';

const TypeOrmRootModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'mariadb',
    host: configService.get<string>('MARIADB_HOST'),
    port: Number(configService.get<string>('MARIADB_PORT')),
    username: configService.get<string>('MARIADB_USER'),
    password: configService.get<string>('MARIADB_PASSWORD'),
    database: configService.get<string>('MARIADB_DATABASE'),
    charset: 'utf8mb4',
    synchronize: false,
    logging: false,
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  }),
});

@Module({
  imports: [TypeOrmRootModule],
  exports: [TypeOrmRootModule],
})
export class DatabaseModule {}

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'mariadb',
  host: process.env.MARIADB_HOST,
  port: parseInt(process.env.MARIADB_PORT || '3306', 10),
  username: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: false,
});

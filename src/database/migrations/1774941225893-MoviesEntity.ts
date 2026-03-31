import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoviesEntity1774941225893 implements MigrationInterface {
  name = 'MoviesEntity1774941225893';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`movie\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`episode_id\` int NOT NULL, \`director\` varchar(255) NOT NULL, \`producer\` varchar(255) NOT NULL, \`release_date\` varchar(255) NOT NULL, \`opening_crawl\` text NOT NULL, \`characters\` text NULL, \`planets\` text NULL, \`starships\` text NULL, \`vehicles\` text NULL, \`species\` text NULL, \`swapi_id\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_2868f1e6af387afeea4b338e79\` (\`swapi_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_2868f1e6af387afeea4b338e79\` ON \`movie\``,
    );
    await queryRunner.query(`DROP TABLE \`movie\``);
  }
}

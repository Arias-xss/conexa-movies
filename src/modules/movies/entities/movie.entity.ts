import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ name: 'episode_id' })
  episodeId: number;

  @Column({ type: 'varchar' })
  director: string;

  @Column({ type: 'varchar' })
  producer: string;

  @Column({ name: 'release_date', type: 'varchar' })
  releaseDate: string;

  @Column({ name: 'opening_crawl', type: 'text' })
  openingCrawl: string;

  @Column({ type: 'simple-json', nullable: true })
  characters: string[];

  @Column({ type: 'simple-json', nullable: true })
  planets: string[];

  @Column({ type: 'simple-json', nullable: true })
  starships: string[];

  @Column({ type: 'simple-json', nullable: true })
  vehicles: string[];

  @Column({ type: 'simple-json', nullable: true })
  species: string[];

  @Column({ name: 'swapi_id', type: 'varchar', nullable: true, unique: true })
  swapiId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

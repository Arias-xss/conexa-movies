import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

interface SwapiFilmProperties {
  title: string;
  episode_id: number;
  director: string;
  producer: string;
  release_date: string;
  opening_crawl: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
}

interface SwapiFilm {
  properties: SwapiFilmProperties;
  uid: string;
}

interface SwapiFilmsResponse {
  result: SwapiFilm[];
}

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    private readonly configService: ConfigService,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.moviesRepository.create(createMovieDto);
    return await this.moviesRepository.save(movie);
  }

  async findAll(): Promise<Pick<Movie, 'id' | 'title'>[]> {
    return await this.moviesRepository.find({ select: ['id', 'title'] });
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOneBy({ id });
    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }
    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);
    Object.assign(movie, updateMovieDto);
    return await this.moviesRepository.save(movie);
  }

  async remove(id: number): Promise<void> {
    const movie = await this.findOne(id);
    await this.moviesRepository.remove(movie);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncFromSwapi(): Promise<{ synced: number }> {
    this.logger.log('Starting SWAPI films sync...');
    const baseUrl = this.configService.get<string>('MOVIES_BASE_URL');

    const response = await fetch(`${baseUrl}/films`);
    const data: SwapiFilmsResponse =
      (await response.json()) as SwapiFilmsResponse;

    let synced = 0;
    for (const film of data.result) {
      const filmData = {
        title: film.properties.title,
        episodeId: film.properties.episode_id,
        director: film.properties.director,
        producer: film.properties.producer,
        releaseDate: film.properties.release_date,
        openingCrawl: film.properties.opening_crawl,
        characters: film.properties.characters,
        planets: film.properties.planets,
        starships: film.properties.starships,
        vehicles: film.properties.vehicles,
        species: film.properties.species,
        swapiId: film.uid,
      };

      const existing = await this.moviesRepository.findOneBy({
        swapiId: film.uid,
      });

      if (existing) {
        Object.assign(existing, filmData);
        await this.moviesRepository.save(existing);
      } else {
        const movie = this.moviesRepository.create(filmData);
        await this.moviesRepository.save(movie);
      }
      synced++;
    }

    this.logger.log(`SWAPI sync completed. ${synced} films processed.`);
    return { synced };
  }
}

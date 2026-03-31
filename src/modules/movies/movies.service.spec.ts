import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

const mockMovie: Movie = {
  id: 1,
  title: 'A New Hope',
  episodeId: 4,
  director: 'George Lucas',
  producer: 'Gary Kurtz, Rick McCallum',
  releaseDate: '1977-05-25',
  openingCrawl: 'It is a period of civil war...',
  characters: ['https://www.swapi.tech/api/people/1'],
  planets: ['https://www.swapi.tech/api/planets/1'],
  starships: ['https://www.swapi.tech/api/starships/2'],
  vehicles: ['https://www.swapi.tech/api/vehicles/4'],
  species: ['https://www.swapi.tech/api/species/1'],
  swapiId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockMoviesRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('https://www.swapi.tech/api'),
};

const swapiResponse = {
  result: [
    {
      uid: '1',
      properties: {
        title: 'A New Hope',
        episode_id: 4,
        director: 'George Lucas',
        producer: 'Gary Kurtz, Rick McCallum',
        release_date: '1977-05-25',
        opening_crawl: 'It is a period of civil war...',
        characters: ['https://www.swapi.tech/api/people/1'],
        planets: ['https://www.swapi.tech/api/planets/1'],
        starships: ['https://www.swapi.tech/api/starships/2'],
        vehicles: ['https://www.swapi.tech/api/vehicles/4'],
        species: ['https://www.swapi.tech/api/species/1'],
      },
    },
  ],
};

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movie), useValue: mockMoviesRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array with only id and title', async () => {
      const summary = [{ id: mockMovie.id, title: mockMovie.title }];
      mockMoviesRepository.find.mockResolvedValue(summary);

      const result = await service.findAll();

      expect(mockMoviesRepository.find).toHaveBeenCalledWith({
        select: ['id', 'title'],
      });
      expect(result).toEqual(summary);
    });
  });

  describe('findOne', () => {
    it('should return a movie by id', async () => {
      mockMoviesRepository.findOneBy.mockResolvedValue(mockMovie);

      const result = await service.findOne(1);

      expect(mockMoviesRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException when movie is not found', async () => {
      mockMoviesRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(99)).rejects.toThrow(
        'Movie with id 99 not found',
      );
    });
  });

  describe('create', () => {
    it('should create and return a new movie', async () => {
      const dto: CreateMovieDto = {
        title: 'A New Hope',
        episodeId: 4,
        director: 'George Lucas',
        producer: 'Gary Kurtz, Rick McCallum',
        releaseDate: '1977-05-25',
        openingCrawl: 'It is a period of civil war...',
      };

      mockMoviesRepository.create.mockReturnValue(mockMovie);
      mockMoviesRepository.save.mockResolvedValue(mockMovie);

      const result = await service.create(dto);

      expect(mockMoviesRepository.create).toHaveBeenCalledWith(dto);
      expect(mockMoviesRepository.save).toHaveBeenCalledWith(mockMovie);
      expect(result).toEqual(mockMovie);
    });
  });

  describe('update', () => {
    it('should update and return the movie', async () => {
      const dto: UpdateMovieDto = { title: 'A New Hope - Updated' };
      const updatedMovie = { ...mockMovie, title: 'A New Hope - Updated' };

      mockMoviesRepository.findOneBy.mockResolvedValue({ ...mockMovie });
      mockMoviesRepository.save.mockResolvedValue(updatedMovie);

      const result = await service.update(1, dto);

      expect(mockMoviesRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockMoviesRepository.save).toHaveBeenCalled();
      expect(result.title).toEqual('A New Hope - Updated');
    });

    it('should throw NotFoundException when movie to update is not found', async () => {
      mockMoviesRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(99, { title: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove the movie', async () => {
      mockMoviesRepository.findOneBy.mockResolvedValue(mockMovie);
      mockMoviesRepository.remove.mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();

      expect(mockMoviesRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockMoviesRepository.remove).toHaveBeenCalledWith(mockMovie);
    });

    it('should throw NotFoundException when movie to remove is not found', async () => {
      mockMoviesRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('syncFromSwapi', () => {
    it('should sync new movies from SWAPI and return count', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(swapiResponse),
      } as unknown as Response);

      mockMoviesRepository.findOneBy.mockResolvedValue(null);
      mockMoviesRepository.create.mockReturnValue(mockMovie);
      mockMoviesRepository.save.mockResolvedValue(mockMovie);

      const result = await service.syncFromSwapi();

      expect(fetch).toHaveBeenCalledWith('https://www.swapi.tech/api/films');
      expect(result).toEqual({ synced: 1 });
    });

    it('should update existing movies during sync', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(swapiResponse),
      } as unknown as Response);

      mockMoviesRepository.findOneBy.mockResolvedValue({ ...mockMovie });
      mockMoviesRepository.save.mockResolvedValue(mockMovie);

      const result = await service.syncFromSwapi();

      expect(mockMoviesRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ synced: 1 });
    });
  });
});

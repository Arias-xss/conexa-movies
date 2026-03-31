import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { NotFoundException } from '@nestjs/common';

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

const mockMoviesService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  syncFromSwapi: jest.fn(),
};

describe('MoviesController', () => {
  let controller: MoviesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [{ provide: MoviesService, useValue: mockMoviesService }],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array with only id and title', async () => {
      const summary = [{ id: mockMovie.id, title: mockMovie.title }];
      mockMoviesService.findAll.mockResolvedValue(summary);

      const result = await controller.findAll();

      expect(mockMoviesService.findAll).toHaveBeenCalled();
      expect(result).toEqual(summary);
      expect(result[0]).not.toHaveProperty('director');
      expect(result[0]).not.toHaveProperty('openingCrawl');
    });
  });

  describe('findOne', () => {
    it('should return a single movie by id', async () => {
      mockMoviesService.findOne.mockResolvedValue(mockMovie);

      const result = await controller.findOne(1);

      expect(mockMoviesService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMovie);
    });

    it('should propagate NotFoundException from service', async () => {
      mockMoviesService.findOne.mockRejectedValue(
        new NotFoundException('Movie with id 99 not found'),
      );

      await expect(controller.findOne(99)).rejects.toThrow(NotFoundException);
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

      mockMoviesService.create.mockResolvedValue(mockMovie);

      const result = await controller.create(dto);

      expect(mockMoviesService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockMovie);
    });
  });

  describe('update', () => {
    it('should update and return the movie', async () => {
      const dto: UpdateMovieDto = { title: 'A New Hope - Remastered' };
      const updatedMovie = { ...mockMovie, title: 'A New Hope - Remastered' };

      mockMoviesService.update.mockResolvedValue(updatedMovie);

      const result = await controller.update(1, dto);

      expect(mockMoviesService.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updatedMovie);
    });

    it('should propagate NotFoundException from service', async () => {
      mockMoviesService.update.mockRejectedValue(
        new NotFoundException('Movie with id 99 not found'),
      );

      await expect(controller.update(99, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      mockMoviesService.remove.mockResolvedValue(undefined);

      await expect(controller.remove(1)).resolves.toBeUndefined();
      expect(mockMoviesService.remove).toHaveBeenCalledWith(1);
    });

    it('should propagate NotFoundException from service', async () => {
      mockMoviesService.remove.mockRejectedValue(
        new NotFoundException('Movie with id 99 not found'),
      );

      await expect(controller.remove(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('syncFromSwapi', () => {
    it('should trigger sync and return result', async () => {
      mockMoviesService.syncFromSwapi.mockResolvedValue({ synced: 6 });

      const result = await controller.syncFromSwapi();

      expect(mockMoviesService.syncFromSwapi).toHaveBeenCalled();
      expect(result).toEqual({ synced: 6 });
    });
  });
});

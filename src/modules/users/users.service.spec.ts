import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoles, Users } from './entities/users.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

const mockUser: Users = {
  id: 1,
  username: 'john_doe',
  email: 'john_doe@example.com',
  password: 'hashedPassword',
  role: UserRoles.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
  hashPassword: jest.fn(),
  validatePassword: jest.fn(),
};

const mockRepository = {
  save: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      username: 'john_doe',
      email: 'john_doe@example.com',
      password: 'securePass1',
    };

    it('should create and return a user', async () => {
      jest.spyOn(mockRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(repository.save).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should propagate repository errors', async () => {
      const error = new Error('DB error');
      jest.spyOn(mockRepository, 'save').mockRejectedValue(error);

      await expect(service.create(createUserDto)).rejects.toThrow('DB error');
    });
  });

  describe('findOne', () => {
    it('should return a user when both id and email are provided', async () => {
      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(mockUser);

      const result = await service.findOne({
        id: 1,
        email: 'john_doe@example.com',
      });

      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: 1,
        email: 'john_doe@example.com',
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException when id is missing', async () => {
      await expect(
        service.findOne({ email: 'john_doe@example.com' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when email is missing', async () => {
      await expect(service.findOne({ id: 1 })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when both id and email are missing', async () => {
      await expect(service.findOne({})).rejects.toThrow(
        new BadRequestException(
          'Find service needs at least one filter criteria',
        ),
      );
    });

    it('should return null when no user matches', async () => {
      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.findOne({
        id: 99,
        email: 'notfound@example.com',
      });

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    const usersList: Users[] = [mockUser];

    it('should return a list of users with valid pagination', async () => {
      jest.spyOn(mockRepository, 'find').mockResolvedValue(usersList);

      const result = await service.findAll({ limit: 10, page: 1 });

      expect(repository.find).toHaveBeenCalledWith({
        where: { role: undefined },
        take: 10,
        skip: 0,
      });
      expect(result).toEqual(usersList);
    });

    it('should apply role filter when provided', async () => {
      jest.spyOn(mockRepository, 'find').mockResolvedValue(usersList);

      const result = await service.findAll({
        limit: 10,
        page: 1,
        role: UserRoles.ADMIN,
      });

      expect(repository.find).toHaveBeenCalledWith({
        where: { role: UserRoles.ADMIN },
        take: 10,
        skip: 0,
      });
      expect(result).toEqual(usersList);
    });

    it('should calculate correct skip offset for page 2', async () => {
      jest.spyOn(mockRepository, 'find').mockResolvedValue([]);

      await service.findAll({ limit: 10, page: 2 });

      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10 }),
      );
    });

    it('should throw BadRequestException when both limit and page are falsy', async () => {
      await expect(service.findAll({ limit: 0, page: 0 })).rejects.toThrow(
        new BadRequestException('Limit and page are required'),
      );
    });

    it('should propagate repository errors', async () => {
      const error = new Error('DB error');
      jest.spyOn(mockRepository, 'find').mockRejectedValue(error);

      await expect(service.findAll({ limit: 10, page: 1 })).rejects.toThrow(
        'DB error',
      );
    });
  });
});

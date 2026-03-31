import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRoles, Users } from './entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FindFilter } from './dto/filter-criterias.dto';

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

const mockUsersService = {
  findAll: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const usersList: Users[] = [mockUser];
      jest.spyOn(mockUsersService, 'findAll').mockResolvedValue(usersList);

      const filter: FindFilter = { page: 1, limit: 10 };
      const result = await controller.getAll(filter);

      expect(service.findAll).toHaveBeenCalledWith(filter);
      expect(result).toEqual(usersList);
    });

    it('should return an empty list when no users exist', async () => {
      jest.spyOn(mockUsersService, 'findAll').mockResolvedValue([]);

      const filter: FindFilter = { page: 1, limit: 10 };
      const result = await controller.getAll(filter);

      expect(service.findAll).toHaveBeenCalledWith(filter);
      expect(result).toEqual([]);
    });

    it('should forward role filter to service', async () => {
      const adminUsers = [{ ...mockUser, role: UserRoles.ADMIN }];
      jest.spyOn(mockUsersService, 'findAll').mockResolvedValue(adminUsers);

      const filter: FindFilter = { page: 1, limit: 10, role: UserRoles.ADMIN };
      const result = await controller.getAll(filter);

      expect(service.findAll).toHaveBeenCalledWith(filter);
      expect(result).toEqual(adminUsers);
    });

    it('should propagate BadRequestException from service', async () => {
      jest
        .spyOn(mockUsersService, 'findAll')
        .mockRejectedValue(
          new BadRequestException('Limit and page are required'),
        );

      const filter: FindFilter = { page: 0, limit: 0 };

      await expect(controller.getAll(filter)).rejects.toThrow(
        new BadRequestException('Limit and page are required'),
      );
    });
  });
});

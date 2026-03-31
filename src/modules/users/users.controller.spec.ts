import {
  BadRequestException,
  ForbiddenException,
  INestApplication,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import { UserRoles, Users } from './entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FindFilter } from './dto/filter-criterias.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ROLES_KEY } from '../auth/decorators/roles.decorator';
import * as request from 'supertest';

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

  describe('Role guard enforcement', () => {
    it('should have ADMIN role metadata on getAll handler', () => {
      const roles = Reflect.getMetadata(ROLES_KEY, controller.getAll);
      expect(roles).toEqual([UserRoles.ADMIN]);
    });

    it('should have RolesGuard applied at the controller level', () => {
      const guards: any[] = Reflect.getMetadata('__guards__', UsersController);
      expect(guards).toContain(RolesGuard);
    });

    it('should have AuthGuard applied at the controller level', () => {
      const guards: any[] = Reflect.getMetadata('__guards__', UsersController);
      const JwtGuard = AuthGuard('jwt');
      expect(guards.some((g) => g?.name === JwtGuard.name)).toBe(true);
    });

    it('should return 403 when RolesGuard blocks a non-admin user', async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          { provide: UsersService, useValue: { findAll: jest.fn() } },
          Reflector,
        ],
      })
        .overrideGuard(AuthGuard('jwt'))
        .useValue({ canActivate: () => true })
        .overrideGuard(RolesGuard)
        .useValue({ canActivate: () => false })
        .compile();

      const app: INestApplication = module.createNestApplication();
      await app.init();

      await request(app.getHttpServer()).get('/users').expect(403);

      await app.close();
    });

    it('should return 200 when RolesGuard passes an admin user', async () => {
      const usersList: Users[] = [
        {
          ...mockUser,
          role: UserRoles.ADMIN,
          hashPassword: jest.fn(),
          validatePassword: jest.fn(),
        },
      ];

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          {
            provide: UsersService,
            useValue: { findAll: jest.fn().mockResolvedValue(usersList) },
          },
          Reflector,
        ],
      })
        .overrideGuard(AuthGuard('jwt'))
        .useValue({ canActivate: () => true })
        .overrideGuard(RolesGuard)
        .useValue({ canActivate: () => true })
        .compile();

      const app: INestApplication = module.createNestApplication();
      await app.init();

      await request(app.getHttpServer())
        .get('/users')
        .query({ page: 1, limit: 10 })
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject([
            expect.objectContaining({ id: mockUser.id, role: UserRoles.ADMIN }),
          ]);
        });

      await app.close();
    });
  });
});

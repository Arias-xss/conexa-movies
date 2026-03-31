import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from '../auth.repository';
import { AuthStrategy } from './jwt.strategy';
import { UserRoles, Users } from '../../users/entities/users.entity';
import { JwtPayload } from '../types/jwt-payload.interface';

const mockUser: Users = {
  id: 1,
  username: 'john_doe',
  email: 'john@example.com',
  password: 'hashed_password',
  role: UserRoles.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
  hashPassword: jest.fn(),
  validatePassword: jest.fn(),
};

const mockAuthRepository = {
  findOneBy: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('test_jwt_secret'),
};

describe('AuthStrategy', () => {
  let strategy: AuthStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthStrategy,
        { provide: AuthRepository, useValue: mockAuthRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<AuthStrategy>(AuthStrategy);
    jest.clearAllMocks();
  });

  describe('validate', () => {
    const payload: JwtPayload = { email: 'john@example.com' };

    it('should return the user when a valid payload is provided', async () => {
      mockAuthRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(mockAuthRepository.findOneBy).toHaveBeenCalledWith({
        email: payload.email,
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      mockAuthRepository.findOneBy.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

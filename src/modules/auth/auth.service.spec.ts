import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/credentials.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { UserRoles, Users } from '../users/entities/users.entity';

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
  findOne: jest.fn(),
  validateUserPassword: jest.fn(),
};

const mockUsersService = {
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('signed_jwt_token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: mockAuthRepository },
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    const dto: CreateUserDto = {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should register and return an access token', async () => {
      mockAuthRepository.findOne.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.register(dto);

      expect(mockAuthRepository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ email: dto.email });
      expect(result).toEqual({ accessToken: 'signed_jwt_token' });
    });

    it('should throw ConflictException when email is already in use', async () => {
      mockAuthRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const dto: AuthCredentialsDto = {
      email: 'john@example.com',
      password: 'password123',
    };

    it('should login and return an access token', async () => {
      mockAuthRepository.validateUserPassword.mockResolvedValue(dto.email);

      const result = await service.login(dto);

      expect(mockAuthRepository.validateUserPassword).toHaveBeenCalledWith(dto);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ email: dto.email });
      expect(result).toEqual({ accessToken: 'signed_jwt_token' });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      mockAuthRepository.validateUserPassword.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });
});

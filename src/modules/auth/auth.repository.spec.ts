import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { UserRoles, Users } from '../users/entities/users.entity';
import { AuthCredentialsDto } from './dto/credentials.dto';

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

const mockDataSource = {
  manager: {},
} as unknown as DataSource;

describe('AuthRepository', () => {
  let repository: AuthRepository;

  beforeEach(() => {
    repository = new AuthRepository(mockDataSource);
    jest.clearAllMocks();
  });

  describe('validateUserPassword', () => {
    const dto: AuthCredentialsDto = {
      email: 'john@example.com',
      password: 'password123',
    };

    it('should return the email when credentials are valid', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
      mockUser.validatePassword = jest.fn().mockResolvedValue(true);

      const result = await repository.validateUserPassword(dto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
        select: { id: true, password: true, email: true },
      });
      expect(result).toBe(mockUser.email);
    });

    it('should return null when user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await repository.validateUserPassword(dto);

      expect(result).toBeNull();
    });

    it('should return null when password does not match', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
      mockUser.validatePassword = jest.fn().mockResolvedValue(false);

      const result = await repository.validateUserPassword(dto);

      expect(result).toBeNull();
    });
  });

  describe('decryptPassword', () => {
    it('should return a bcrypt hash of the password', async () => {
      const plain = 'password123';
      const result = await repository.decryptPassword(plain);

      const isMatch = await bcrypt.compare(plain, result);
      expect(isMatch).toBe(true);
    });
  });
});

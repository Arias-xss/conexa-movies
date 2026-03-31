import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoles, Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}
  logger = new Logger('UsersService');

  async create(userDto: CreateUserDto): Promise<Users> {
    try {
      return await this.usersRepository.save(userDto);
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findOne({ id, email }: { id?: number; email?: string }) {
    try {
      if (!id || !email)
        throw new BadRequestException(
          'Find service needs at least one filter criteria',
        );

      return await this.usersRepository.findOneBy({ id, email });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findAll({
    limit,
    page,
    role,
  }: {
    limit: number;
    page: number;
    role?: UserRoles;
  }) {
    try {
      if (!limit && !page)
        throw new BadRequestException('Limit and page are required');

      return await this.usersRepository.find({
        where: { role },
        take: limit,
        skip: (page - 1) * limit,
      });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { Users } from '../users/entities/users.entity';
import { AuthCredentialsDto } from './dto/credentials.dto';

@Injectable()
export class AuthRepository extends Repository<Users> {
  constructor(dataSource: DataSource) {
    super(Users, dataSource.manager);
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string | null> {
    const { email, password } = authCredentialsDto;

    const user = await this.findOne({
      where: { email },
      select: { id: true, password: true, email: true },
    });

    if (user && (await user.validatePassword(password, user.password))) {
      return user.email;
    } else {
      return null;
    }
  }

  async decryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}

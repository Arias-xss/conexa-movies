import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { FindFilter } from './dto/filter-criterias.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from './entities/users.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Response of users by criteria',
  })
  @ApiOperation({ summary: 'List of all users by given criteria' })
  async getAll(@Query() filter: FindFilter) {
    return await this.usersService.findAll(filter);
  }
}

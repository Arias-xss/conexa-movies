import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { FindFilter } from './dto/filter-criterias.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of all users by given criteria',
  })
  async getAll(@Query() filter: FindFilter) {
    return await this.usersService.findAll(filter);
  }
}

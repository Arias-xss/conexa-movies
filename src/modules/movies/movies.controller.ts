import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRoles } from '../users/entities/users.entity';

@ApiTags('Movies')
@ApiBearerAuth('JWT-auth')
@Controller('movies')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of all movies (authenticated users)' })
  @ApiOkResponse({ description: 'List of movies returned successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @Roles(UserRoles.USER)
  @ApiOperation({
    summary: 'Get details of a specific movie (Regular Users only)',
  })
  @ApiOkResponse({ description: 'Movie details returned successfully' })
  @ApiNotFoundResponse({ description: 'Movie not found' })
  @ApiForbiddenResponse({ description: 'Forbidden - Regular Users only' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Post()
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Create a new movie (Admins only)' })
  @ApiCreatedResponse({ description: 'Movie created successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admins only' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Put(':id')
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Update a movie (Admins only)' })
  @ApiOkResponse({ description: 'Movie updated successfully' })
  @ApiNotFoundResponse({ description: 'Movie not found' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admins only' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a movie (Admins only)' })
  @ApiNoContentResponse({ description: 'Movie deleted successfully' })
  @ApiNotFoundResponse({ description: 'Movie not found' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admins only' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }

  @Post('sync')
  @Roles(UserRoles.ADMIN)
  @ApiOperation({
    summary: 'Sync movies from Star Wars API (Admins only)',
    description:
      'Fetches all films from the SWAPI and upserts them into the local database. Also runs automatically every day at midnight.',
  })
  @ApiOkResponse({
    description: 'Sync completed',
    schema: { example: { synced: 6 } },
  })
  @ApiForbiddenResponse({ description: 'Forbidden - Admins only' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  syncFromSwapi() {
    return this.moviesService.syncFromSwapi();
  }
}

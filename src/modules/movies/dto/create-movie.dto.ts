import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'A New Hope' })
  @IsString()
  title: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  episodeId: number;

  @ApiProperty({ example: 'George Lucas' })
  @IsString()
  director: string;

  @ApiProperty({ example: 'Gary Kurtz, Rick McCallum' })
  @IsString()
  producer: string;

  @ApiProperty({ example: '1977-05-25' })
  @IsString()
  releaseDate: string;

  @ApiProperty({ example: 'It is a period of civil war...' })
  @IsString()
  openingCrawl: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['https://www.swapi.tech/api/people/1'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characters?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['https://www.swapi.tech/api/planets/1'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  planets?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['https://www.swapi.tech/api/starships/2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  starships?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['https://www.swapi.tech/api/vehicles/4'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  vehicles?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['https://www.swapi.tech/api/species/1'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  species?: string[];
}

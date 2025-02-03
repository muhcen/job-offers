import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetJobOffersDto {
  @ApiProperty({
    description: 'Job title to filter job offers by',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'City to filter job offers by',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'State to filter job offers by',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'Minimum salary to filter job offers by',
    required: false,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber()
  @Min(0, { message: 'minSalary must not be less than 0' })
  minSalary?: number;

  @ApiProperty({
    description: 'Maximum salary to filter job offers by',
    required: false,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber()
  @Max(1000000, { message: 'maxSalary must not exceed 1,000,000' })
  maxSalary?: number;

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    type: Number,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber()
  @Min(1, { message: 'page must not be less than 1' })
  page = 1;

  @ApiProperty({
    description: 'Limit the number of job offers per page',
    required: false,
    type: Number,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber()
  @Min(1, { message: 'limit must not be less than 1' })
  limit = 10;
}

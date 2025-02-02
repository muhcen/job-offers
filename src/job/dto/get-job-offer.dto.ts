import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class GetJobOffersDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber()
  @Min(0, { message: 'minSalary must not be less than 0' })
  minSalary?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber()
  @Max(1000000, { message: 'maxSalary must not exceed 1,000,000' })
  maxSalary?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber()
  @Min(1, { message: 'page must not be less than 1' })
  page = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber()
  @Min(1, { message: 'limit must not be less than 1' })
  limit = 10;
}

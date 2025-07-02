// backend/src/jobs/dto/list-jobs.dto.ts
import { IsString, IsArray, IsOptional, IsInt } from 'class-validator';

export class ListJobsDto {
  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsString()
  @IsOptional()
  salary?: string;

  @IsString()
  @IsOptional()
  jobTitle?: string;

  @IsArray()
  @IsOptional()
  jobType?: string[];

  // Pagination properties
  @IsInt()
  @IsOptional()
  page: number = 1;

  @IsInt()
  @IsOptional()
  limit: number = 10;
}

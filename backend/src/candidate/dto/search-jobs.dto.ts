import { IsString, IsArray, IsOptional, IsInt } from 'class-validator';

export class SearchJobsDto {
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

  @IsInt()
  @IsOptional()
  page: number = 1;

  @IsInt()
  @IsOptional()
  limit: number = 10;
}

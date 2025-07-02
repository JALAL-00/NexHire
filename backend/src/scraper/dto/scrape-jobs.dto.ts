import { IsString, IsOptional, IsNumber } from 'class-validator';

export class ScrapeJobsDto {
  @IsString()
  source: string; // 'linkedin', 'indeed', 'glassdoor'

  @IsString()
  searchTerm: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  limit?: number = 10;
}
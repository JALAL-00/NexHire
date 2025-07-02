import { IsString, IsArray, IsOptional, IsDate, IsNumber, Min } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  responsibilities?: string;

  @IsString()
  location: string;

  @IsString()
  salary: string;

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsString()
  @IsOptional()
  experience?: string;

  @IsDate()
  @IsOptional()
  expirationDate?: string;

  @IsString()
  @IsOptional()
  jobType?: string;

  @IsString()
  @IsOptional()
  jobLevel?: string;

  @IsString()
  @IsOptional()
  education?: string; // Add education field
}

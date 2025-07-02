// backend/src/recruiter/dto/create-job.dto.ts
import { IsString, IsArray, IsOptional, IsDateString } from 'class-validator';

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
  @IsOptional()
  salary?: string;

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsString()
  experience: string;

  @IsDateString()
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
  education?: string;  
}

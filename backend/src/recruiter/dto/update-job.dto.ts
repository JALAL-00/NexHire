// backend/src/recruiter/dto/update-job.dto.ts
import { IsString, IsNumber, IsOptional, IsArray, IsDateString } from 'class-validator';

export class UpdateJobDto {
  @IsNumber()
  jobId: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
  
  @IsString()
  @IsOptional()
  responsibilities?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  salary?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsString()
  @IsOptional()
  experience?: string;

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
  education?: string;  // NEW FIELD ADDED FOR UPDATE
}

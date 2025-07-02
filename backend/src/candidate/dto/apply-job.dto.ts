import { IsString, IsOptional, IsNumber } from 'class-validator';

export class ApplyJobDto {
  @IsNumber()
  jobId: number;

  @IsString()
  @IsOptional()
  coverLetter?: string;
}
import { IsNotEmpty, IsDateString, IsEnum, IsString, IsOptional, IsNumber } from 'class-validator';
import { InterviewType } from '../entities/interview.entity';

export class CreateInterviewDto {
  @IsNumber()
  @IsNotEmpty()
  applicationId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(InterviewType)
  @IsNotEmpty()
  type: InterviewType;

  @IsString()
  @IsOptional()
  locationOrLink?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
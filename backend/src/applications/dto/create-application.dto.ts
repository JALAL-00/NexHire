import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsOptional()
  coverLetter?: string;  // Optional cover letter field

  @IsNumber()  
  jobId: number;  

  @IsString() 
  resume: string;  
}

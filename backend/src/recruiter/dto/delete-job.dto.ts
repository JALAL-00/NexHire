import { IsNumber } from 'class-validator';

export class DeleteJobDto {
  @IsNumber()
  jobId: number;
}
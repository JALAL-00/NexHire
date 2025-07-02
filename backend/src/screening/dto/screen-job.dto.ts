import { IsNumber } from 'class-validator';

export class ScreenJobDto {
  @IsNumber()
  jobId: number;
}
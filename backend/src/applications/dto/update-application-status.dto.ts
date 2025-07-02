import { IsNumber, IsString, IsIn } from 'class-validator';

export class UpdateApplicationStatusDto {
  @IsNumber()
  applicationId: number;

  @IsString()
  @IsIn(['pending', 'accepted', 'rejected'])
  status: string;
}
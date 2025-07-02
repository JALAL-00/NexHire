import { IsString, IsArray, IsOptional } from 'class-validator';

export class SearchCandidateDto {
  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsString()
  @IsOptional()
  experience?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  title?: string;
  name: any;
}

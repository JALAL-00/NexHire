import { IsArray, IsString, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class ExperienceEntryDto {
    @IsString()
    title: string;
    @IsString()
    org: string;
    @IsString()
    duration: string;
    @IsString()
    location: string;
    @IsString()
    desc: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  title?: string;
  
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ExperienceEntryDto)
  experience?: ExperienceEntryDto[];
  
  @IsArray()
  @IsOptional()
  education?: any[];

  @IsString()
  @IsOptional()
  companyName?: string;
  
  @IsString()
  @IsOptional()
  designation?: string;
  
  @IsString()
  @IsOptional()
  phone?: string;
  
  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  about?: string;
}
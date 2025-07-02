import { IsArray, IsString, IsOptional, IsBoolean, ValidateNested, IsObject } from 'class-validator';
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

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  availability?: string;

  @IsString()
  @IsOptional()
  location?: string;
  
  @IsString()
  @IsOptional()
  about?: string;
  
  @IsString()
  @IsOptional()
  services?: string;
  
  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true }) 
  @Type(() => ExperienceEntryDto) 
  experience?: ExperienceEntryDto[];

  @IsArray()
  @IsOptional()
  education?: { institution: string; degree: string; year: number }[];

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}
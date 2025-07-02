import { Controller, Post, Body, UseGuards, SetMetadata } from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { ScreenJobDto } from './dto/screen-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from '../auth/entities/user.entity';

@Controller('screening')
@UseGuards(JwtAuthGuard, RoleGuard)
@SetMetadata('role', UserRole.RECRUITER)
export class ScreeningController {
  constructor(private screeningService: ScreeningService) {}

  @Post('job')
  async screenResumes(@Body() screenJobDto: ScreenJobDto): Promise<any[]> {
    const results = await this.screeningService.screenResumes(screenJobDto.jobId);
    return results.map((result) => ({
      candidateId: result.candidate.id,
      candidateEmail: result.candidate.email,
      score: result.score,
      matchedKeywords: result.matchedKeywords,
    }));
  }
  
}
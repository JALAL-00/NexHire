import { Controller, Get, Patch, Req, Body, UseGuards, SetMetadata, Param, ParseIntPipe } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from '../auth/entities/user.entity';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';

@Controller('applications')
@UseGuards(JwtAuthGuard, RoleGuard)
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  // Route for candidates to see their applications
  @Get()
  @SetMetadata('role', UserRole.CANDIDATE)  
  findApplicationsByCandidate(@Req() req) {
    return this.applicationsService.findByCandidate(req.user.id); 
  }

  // Route for recruiters to see applications for jobs they posted
  @Get('job-applications')
  @SetMetadata('role', UserRole.RECRUITER) 
  findApplicationsByRecruiter(@Req() req) {
    return this.applicationsService.findByRecruiter(req.user.id);  
  }

  // Route for recruiters to see applications for a specific job
  @Get('job/:jobId')
  @SetMetadata('role', UserRole.RECRUITER)
  findByJobForRecruiter(
    @Req() req, 
    @Param('jobId', ParseIntPipe) jobId: number
  ) {
    return this.applicationsService.findByJobForRecruiter(req.user.id, jobId); 
  }

  // Route for recruiters to update the status of an application
  @Patch('status')
  @SetMetadata('role', UserRole.RECRUITER)
  updateStatus(@Body() updateApplicationStatusDto: UpdateApplicationStatusDto) {
    return this.applicationsService.updateStatus(
      updateApplicationStatusDto.applicationId,
      updateApplicationStatusDto.status,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('recent')
  async findRecentApplicants(@Req() req: RequestWithUser) {
    const recruiterId = req.user.id;
    return this.applicationsService.findRecentApplicants(recruiterId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('shortlisted')
  async findShortlistedApplicants(@Req() req: RequestWithUser) {
    const recruiterId = req.user.id;
    return this.applicationsService.findShortlistedByRecruiter(recruiterId);
  }
}

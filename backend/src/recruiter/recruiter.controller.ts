import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Req, HttpCode, HttpStatus, SetMetadata, Param, Query, ForbiddenException } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SearchCandidateDto } from './dto/search-candidate.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from '../auth/entities/user.entity';
import { RequestWithUser } from '../common/types/request-with-user.interface';
import { AuthService } from 'src/auth/auth.service';



@Controller('recruiter')
@UseGuards(JwtAuthGuard, RoleGuard)
@SetMetadata('role', UserRole.RECRUITER)
export class RecruiterController {
  constructor(private recruiterService: RecruiterService, private readonly authService: AuthService,) {}

  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return this.recruiterService.getProfile(req.user.id);
  }

  @Patch('profile')
  updateProfile(@Req() req: RequestWithUser, @Body() updateProfileDto: UpdateProfileDto) {
    return this.recruiterService.updateProfile(req.user.id, updateProfileDto);
  }

  @Post('jobs')
  async createJob(@Req() req: RequestWithUser, @Body() createJobDto: CreateJobDto) {
    const isPremium = await this.authService.isUserPremium(req.user.id);
    const existingJobsCount = await this.recruiterService.getJobsCount(req.user.id);

    if (existingJobsCount > 0 && !isPremium) {
      throw new ForbiddenException('You must upgrade to a premium plan to post more than one job.');
    }

    return this.recruiterService.createJob(req.user.id, createJobDto);
  }

  @Get('jobs/all')
  listAllJobs(@Req() req: RequestWithUser) {
    return this.recruiterService.listJobs(req.user.id);
  }

  @Get('jobs')
  listJobs(@Req() req: RequestWithUser, @Query('page') page = '1', @Query('limit') limit = '10') {
    return this.recruiterService.listJobsPaginated(req.user.id, parseInt(page), parseInt(limit));
  }

  @Patch('jobs')
  updateJob(@Req() req: RequestWithUser, @Body() updateJobDto: UpdateJobDto) {
    const { jobId } = updateJobDto;
    return this.recruiterService.updateJob(req.user.id, jobId, updateJobDto);
  }

  @Delete('jobs')
  deleteJob(@Req() req: RequestWithUser, @Body() { jobId }: { jobId: number }) {
    return this.recruiterService.deleteJob(req.user.id, jobId);
  }

  @Get('job-status')
  checkJobStatus(@Req() req: RequestWithUser) {
    return this.recruiterService.checkJobPostingStatus(req.user.id);
  }

  @Get(':id/applications')
  viewApplications(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.recruiterService.viewApplications(req.user.id, +id);
  }

  @Post('search-candidates')
  @HttpCode(HttpStatus.OK)
  searchCandidates(@Body() searchCandidateDto: SearchCandidateDto) {
    return this.recruiterService.searchCandidates(searchCandidateDto);
  }

  @Post('messages')
  sendMessage(@Req() req: RequestWithUser, @Body() sendMessageDto: SendMessageDto) {
    return this.recruiterService.sendMessage(req.user.id, sendMessageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard-stats')
  getDashboardStats(@Req() req: RequestWithUser) {
    const recruiterId = req.user.id;
    return this.recruiterService.getDashboardStats(recruiterId);
  }
}
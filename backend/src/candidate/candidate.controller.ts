// src/candidate/candidate.controller.ts
import { Controller, Get, Post, Patch, Delete, Req, Body, UseGuards, UploadedFile, UseInterceptors, BadRequestException, SetMetadata, Param, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidateService } from './candidate.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from '../auth/entities/user.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateApplicationDto } from '../applications/dto/create-application.dto';
import { ApplicationsService } from '../applications/applications.service';

@Controller('candidate')
@UseGuards(JwtAuthGuard)
@SetMetadata('role', UserRole.CANDIDATE) // Apply to all routes in this controller
export class CandidateController {
  constructor(
    private candidateService: CandidateService,
    private applicationsService: ApplicationsService,
  ) {}

  @Get('profile')
  getProfile(@Req() req) {
    return this.candidateService.getProfile(req.user.id);
  }

  @Patch('profile')
  updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.candidateService.updateProfile(req.user.id, updateProfileDto);
  }

  @Post('resume')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './uploads/resumes',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = /\.(pdf|doc|docx|ppt|pptx|xls|xlsx)$/i;
        if (!file.originalname.match(allowedTypes)) {
          return cb(new BadRequestException('Only PDF, DOC, PPT, or XLS files are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadResume(@Req() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.candidateService.uploadResume(req.user.id, file);
  }

  @Delete('resume')
  deleteResume(@Req() req) {
    return this.candidateService.deleteResume(req.user.id);
  }

  @Post('search-jobs')
  searchJobs(@Body() searchJobsDto: SearchJobsDto) {
    return this.candidateService.searchJobs(searchJobsDto);
  }

  @Post('apply-job')
  applyJob(@Req() req, @Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(req.user.id, createApplicationDto);
  }

    @Get('saved-jobs')
  getSavedJobs(@Req() req) {
    return this.candidateService.getSavedJobs(req.user.id);
  }

  @Post('saved-jobs/:jobId')
  saveJob(@Req() req, @Param('jobId', ParseIntPipe) jobId: number) {
    return this.candidateService.saveJob(req.user.id, jobId);
  }

  @Delete('saved-jobs/:jobId')
  unsaveJob(@Req() req, @Param('jobId', ParseIntPipe) jobId: number) {
    return this.candidateService.unsaveJob(req.user.id, jobId);
  }
}
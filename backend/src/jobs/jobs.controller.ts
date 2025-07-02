import { Controller, Post, Body, Get, Param, NotFoundException, Query, UseGuards, Req } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ListJobsDto } from './dto/list-jobs.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/types/request-with-user.interface';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get('my-jobs/count')
  @UseGuards(JwtAuthGuard)
  async getMyJobsCount(@Req() req: RequestWithUser) {
    // We assume only recruiters will call this, but a role guard would be even better.
    const count = await this.jobsService.countJobsByRecruiter(req.user.id);
    return { count };
  }

  @Get('recommendations')
  async findRecommendations(@Query('limit') limit: string = '2') {
      return this.jobsService.findLatest(parseInt(limit, 10));
  }

  @Get(':id') 
  async findOne(@Param('id') id: string) {
    try {
      return await this.jobsService.findOne(+id);
    } catch (error) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
  }

  @Post()
  async findAll(@Body() listJobsDto: ListJobsDto) {
    try {
      return await this.jobsService.findAll(listJobsDto);
    } catch (error) {
      throw new Error('Error fetching job listings');
    }
  }
  
}

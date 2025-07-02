import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScrapeJobsDto } from './dto/scrape-jobs.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('scraper')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post('jobs')
  @ApiOperation({ summary: 'Scrape jobs from various platforms (authenticated)' })
  @ApiResponse({ status: 200, description: 'List of scraped jobs' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async scrapeJobs(@Body() scrapeJobsDto: ScrapeJobsDto, @Request() req) {
    return this.scraperService.scrapeJobs(scrapeJobsDto, req.user.id);
  }
}
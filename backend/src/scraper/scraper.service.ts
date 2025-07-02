import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScrapeJobsDto } from './dto/scrape-jobs.dto';
import { JobData } from './interfaces/job-data.interface';
import { ScrapedJob } from './entities/scraped-job.entity';
import { User } from '../auth/entities/user.entity';
import { LinkedinStrategy } from './strategies/linkedin.strategy';
import { IndeedStrategy } from './strategies/indeed.strategy';
import { BdjobsStrategy } from './strategies/bdjobs.strategy';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private strategies = {
    linkedin: new LinkedinStrategy(),
    indeed: new IndeedStrategy(),
    bdjobs: new BdjobsStrategy(),
  };

  constructor(
    @InjectRepository(ScrapedJob)
    private scrapedJobRepository: Repository<ScrapedJob>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async scrapeJobs(scrapeJobsDto: ScrapeJobsDto, userId: number): Promise<JobData[]> {
    try {
      const strategy = this.strategies[scrapeJobsDto.source];
      if (!strategy) {
        throw new Error(`Unsupported source: ${scrapeJobsDto.source}`);
      }

      const jobs = await strategy.scrape({
        searchTerm: scrapeJobsDto.searchTerm,
        location: scrapeJobsDto.location,
        limit: scrapeJobsDto.limit,
      });

      // Save scraped jobs to the database
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      for (const job of jobs) {
        const scrapedJob = this.scrapedJobRepository.create({
          ...job,
          user,
        });
        await this.scrapedJobRepository.save(scrapedJob);
      }

      return jobs;
    } catch (error) {
      this.logger.error(`Scraping failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
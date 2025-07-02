import { Repository } from 'typeorm';
import { ScrapeJobsDto } from './dto/scrape-jobs.dto';
import { JobData } from './interfaces/job-data.interface';
import { ScrapedJob } from './entities/scraped-job.entity';
import { User } from '../auth/entities/user.entity';
export declare class ScraperService {
    private scrapedJobRepository;
    private userRepository;
    private readonly logger;
    private strategies;
    constructor(scrapedJobRepository: Repository<ScrapedJob>, userRepository: Repository<User>);
    scrapeJobs(scrapeJobsDto: ScrapeJobsDto, userId: number): Promise<JobData[]>;
}

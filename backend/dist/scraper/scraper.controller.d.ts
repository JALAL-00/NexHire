import { ScraperService } from './scraper.service';
import { ScrapeJobsDto } from './dto/scrape-jobs.dto';
export declare class ScraperController {
    private readonly scraperService;
    constructor(scraperService: ScraperService);
    scrapeJobs(scrapeJobsDto: ScrapeJobsDto, req: any): Promise<import("./interfaces/job-data.interface").JobData[]>;
}

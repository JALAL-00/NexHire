import { Injectable, Logger } from "@nestjs/common";
import puppeteer from "puppeteer";
import { JobData } from "../interfaces/job-data.interface";

@Injectable()
export class IndeedStrategy {
  private readonly logger = new Logger(IndeedStrategy.name);
  async scrape(params: { searchTerm: string; location?: string; limit?: number }): Promise<JobData[]> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    const url = `https://www.indeed.com/jobs?q=${encodeURIComponent(params.searchTerm)}${params.location ? `&l=${encodeURIComponent(params.location)}` : ''}`;
    this.logger.log(`Navigating to URL: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('.jobsearch-ResultsList', { timeout: 10000 }).catch((err) => this.logger.error('Job listings not found', err));
      const jobs = await page.evaluate((limit, location) => {
        const jobElements = Array.from(document.querySelectorAll('.jobsearch-ResultsList > li'));
        let filteredJobs = jobElements;
        if (location) {
          filteredJobs = jobElements.filter((el) => {
            const loc = el.querySelector('.companyLocation')?.textContent?.trim().toLowerCase();
            return loc && loc.includes(location.toLowerCase());
          });
        }
        return filteredJobs.slice(0, limit).map((el) => ({
          title: el.querySelector('.jobTitle a')?.textContent?.trim() || '',
          company: el.querySelector('.companyName')?.textContent?.trim() || '',
          location: el.querySelector('.companyLocation')?.textContent?.trim() || '',
          description: '',
          url: `https://www.indeed.com${el.querySelector('.jobTitle a')?.getAttribute('href') || ''}`,
          source: 'indeed',
        }));
      }, params.limit || 10, params.location || '');
      this.logger.log(`Scraped ${jobs.length} jobs from Indeed`);
      await browser.close();
      return jobs;
    } catch (error) {
      this.logger.error(`Indeed scraping failed: ${error.message}`, error.stack);
      await browser.close();
      throw error;
    }
  }
}
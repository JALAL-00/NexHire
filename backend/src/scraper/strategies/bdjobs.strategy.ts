import { Injectable, Logger } from "@nestjs/common";
import puppeteer from "puppeteer";
import { JobData } from "../interfaces/job-data.interface";

@Injectable()
export class BdjobsStrategy {
  private readonly logger = new Logger(BdjobsStrategy.name);
  async scrape(params: { searchTerm: string; location?: string; limit?: number }): Promise<JobData[]> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    const url = `https://jobs.bdjobs.com/jobsearch.asp?txtsearch=${encodeURIComponent(params.searchTerm)}`;
    this.logger.log(`Navigating to URL: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('.joblist-rw', { timeout: 10000 }).catch((err) => this.logger.error('Job listings not found', err));
      const jobs = await page.evaluate((limit, location) => {
        const jobElements = Array.from(document.querySelectorAll('.joblist-rw'));
        let filteredJobs = jobElements;
        if (location) {
          filteredJobs = jobElements.filter((el) => {
            const loc = el.querySelector('.location')?.textContent?.trim().toLowerCase();
            return loc && loc.includes(location.toLowerCase());
          });
        }
        return filteredJobs.slice(0, limit).map((el) => ({
          title: el.querySelector('.job-title a')?.textContent?.trim() || '',
          company: el.querySelector('.comp-name')?.textContent?.trim() || '',
          location: el.querySelector('.location')?.textContent?.trim() || '',
          description: '',
          url: `https://jobs.bdjobs.com${el.querySelector('.job-title a')?.getAttribute('href') || ''}`,
          source: 'bdjobs',
        }));
      }, params.limit || 10, params.location || '');
      this.logger.log(`Scraped ${jobs.length} jobs from BDJobs`);
      await browser.close();
      return jobs;
    } catch (error) {
      this.logger.error(`BDJobs scraping failed: ${error.message}`, error.stack);
      await browser.close();
      throw error;
    }
  }
}
import { Injectable } from '@nestjs/common';
import { JobData } from '../interfaces/job-data.interface';
import * as puppeteer from 'puppeteer';

@Injectable()
export class LinkedinStrategy {
  async scrape(params: {
    searchTerm: string;
    location?: string;
    limit?: number;
  }): Promise<JobData[]> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(params.searchTerm)}${params.location ? `&location=${encodeURIComponent(params.location)}` : ''}`;
    
    await page.goto(url, { waitUntil: 'networkidle2' });

    const jobs = await page.evaluate((limit) => {
      const jobElements = Array.from(document.querySelectorAll('.jobs-search__results-list li'));
      return jobElements.slice(0, limit).map((el) => {
        return {
          title: el.querySelector('.base-search-card__title')?.textContent?.trim() || '',
          company: el.querySelector('.base-search-card__subtitle')?.textContent?.trim() || '',
          location: el.querySelector('.job-search-card__location')?.textContent?.trim() || '',
          description: '',
          url: (el.querySelector('.base-card__full-link') as HTMLAnchorElement)?.href || '',
          source: 'linkedin',
        };
      });
    }, params.limit);

    await browser.close();
    return jobs;
  }
}
import { Injectable } from '@nestjs/common';
import { JobData } from '../interfaces/job-data.interface';

import puppeteer from 'puppeteer-extra';
import { Browser } from 'puppeteer'; 
import StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

@Injectable()
export class LinkedinStrategy {
  async scrape(params: {
    searchTerm: string;
    location?: string;
    limit?: number;
  }): Promise<JobData[]> {
    let browser: Browser | null = null; 

    try {
      // --- THIS IS THE FIX ---
      // We are explicitly telling Puppeteer where to find Chrome.
      browser = await puppeteer.launch({
        headless: true,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // Add this line
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      });

      const page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      );
      
      const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(params.searchTerm)}${params.location ? `&location=${encodeURIComponent(params.location)}` : ''}`;
      
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

      await page.waitForSelector('ul.jobs-search__results-list', { timeout: 10000 });

      const jobs = await page.evaluate((limit) => {
        const jobListContainer = document.querySelector('ul.jobs-search__results-list');
        if (!jobListContainer) return [];

        const jobElements = Array.from(jobListContainer.querySelectorAll('li'));
        
        return jobElements.slice(0, limit).map((el) => {
          const title = el.querySelector('.base-search-card__title')?.textContent?.trim() || '';
          const company = el.querySelector('.base-search-card__subtitle')?.textContent?.trim() || '';
          const location = el.querySelector('.job-search-card__location')?.textContent?.trim() || '';
          const url = (el.querySelector('a.base-card__full-link') as HTMLAnchorElement)?.href || '';
          
          return { title, company, location, description: '', url, source: 'linkedin' };
        });
      }, params.limit || 10);

      return jobs.filter(job => job.title && job.url);

    } catch (error) {
      console.error('An error occurred during LinkedIn scraping:', error);
      return [];
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
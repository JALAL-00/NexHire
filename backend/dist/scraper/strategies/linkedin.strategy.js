"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedinStrategy = void 0;
const common_1 = require("@nestjs/common");
const puppeteer_extra_1 = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer_extra_1.default.use(StealthPlugin());
let LinkedinStrategy = class LinkedinStrategy {
    async scrape(params) {
        let browser = null;
        try {
            browser = await puppeteer_extra_1.default.launch({
                headless: true,
                executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
            });
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(params.searchTerm)}${params.location ? `&location=${encodeURIComponent(params.location)}` : ''}`;
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
            await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
            await page.waitForSelector('ul.jobs-search__results-list', { timeout: 10000 });
            const jobs = await page.evaluate((limit) => {
                const jobListContainer = document.querySelector('ul.jobs-search__results-list');
                if (!jobListContainer)
                    return [];
                const jobElements = Array.from(jobListContainer.querySelectorAll('li'));
                return jobElements.slice(0, limit).map((el) => {
                    const title = el.querySelector('.base-search-card__title')?.textContent?.trim() || '';
                    const company = el.querySelector('.base-search-card__subtitle')?.textContent?.trim() || '';
                    const location = el.querySelector('.job-search-card__location')?.textContent?.trim() || '';
                    const url = el.querySelector('a.base-card__full-link')?.href || '';
                    return { title, company, location, description: '', url, source: 'linkedin' };
                });
            }, params.limit || 10);
            return jobs.filter(job => job.title && job.url);
        }
        catch (error) {
            console.error('An error occurred during LinkedIn scraping:', error);
            return [];
        }
        finally {
            if (browser) {
                await browser.close();
            }
        }
    }
};
exports.LinkedinStrategy = LinkedinStrategy;
exports.LinkedinStrategy = LinkedinStrategy = __decorate([
    (0, common_1.Injectable)()
], LinkedinStrategy);
//# sourceMappingURL=linkedin.strategy.js.map
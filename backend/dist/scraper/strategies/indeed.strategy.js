"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var IndeedStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndeedStrategy = void 0;
const common_1 = require("@nestjs/common");
const puppeteer_1 = require("puppeteer");
let IndeedStrategy = IndeedStrategy_1 = class IndeedStrategy {
    logger = new common_1.Logger(IndeedStrategy_1.name);
    async scrape(params) {
        const browser = await puppeteer_1.default.launch({ headless: false });
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
        }
        catch (error) {
            this.logger.error(`Indeed scraping failed: ${error.message}`, error.stack);
            await browser.close();
            throw error;
        }
    }
};
exports.IndeedStrategy = IndeedStrategy;
exports.IndeedStrategy = IndeedStrategy = IndeedStrategy_1 = __decorate([
    (0, common_1.Injectable)()
], IndeedStrategy);
//# sourceMappingURL=indeed.strategy.js.map
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
const puppeteer = require("puppeteer");
let LinkedinStrategy = class LinkedinStrategy {
    async scrape(params) {
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
                    url: el.querySelector('.base-card__full-link')?.href || '',
                    source: 'linkedin',
                };
            });
        }, params.limit);
        await browser.close();
        return jobs;
    }
};
exports.LinkedinStrategy = LinkedinStrategy;
exports.LinkedinStrategy = LinkedinStrategy = __decorate([
    (0, common_1.Injectable)()
], LinkedinStrategy);
//# sourceMappingURL=linkedin.strategy.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ScraperService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const scraped_job_entity_1 = require("./entities/scraped-job.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const linkedin_strategy_1 = require("./strategies/linkedin.strategy");
const indeed_strategy_1 = require("./strategies/indeed.strategy");
const bdjobs_strategy_1 = require("./strategies/bdjobs.strategy");
let ScraperService = ScraperService_1 = class ScraperService {
    scrapedJobRepository;
    userRepository;
    logger = new common_1.Logger(ScraperService_1.name);
    strategies = {
        linkedin: new linkedin_strategy_1.LinkedinStrategy(),
        indeed: new indeed_strategy_1.IndeedStrategy(),
        bdjobs: new bdjobs_strategy_1.BdjobsStrategy(),
    };
    constructor(scrapedJobRepository, userRepository) {
        this.scrapedJobRepository = scrapedJobRepository;
        this.userRepository = userRepository;
    }
    async scrapeJobs(scrapeJobsDto, userId) {
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
        }
        catch (error) {
            this.logger.error(`Scraping failed: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.ScraperService = ScraperService;
exports.ScraperService = ScraperService = ScraperService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(scraped_job_entity_1.ScrapedJob)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ScraperService);
//# sourceMappingURL=scraper.service.js.map
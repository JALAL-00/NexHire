"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperModule = void 0;
const common_1 = require("@nestjs/common");
const scraper_service_1 = require("./scraper.service");
const scraper_controller_1 = require("./scraper.controller");
const auth_module_1 = require("../auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const scraped_job_entity_1 = require("./entities/scraped-job.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const linkedin_strategy_1 = require("./strategies/linkedin.strategy");
const indeed_strategy_1 = require("./strategies/indeed.strategy");
const bdjobs_strategy_1 = require("./strategies/bdjobs.strategy");
let ScraperModule = class ScraperModule {
};
exports.ScraperModule = ScraperModule;
exports.ScraperModule = ScraperModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, typeorm_1.TypeOrmModule.forFeature([scraped_job_entity_1.ScrapedJob, user_entity_1.User])],
        controllers: [scraper_controller_1.ScraperController],
        providers: [scraper_service_1.ScraperService, linkedin_strategy_1.LinkedinStrategy, indeed_strategy_1.IndeedStrategy, bdjobs_strategy_1.BdjobsStrategy],
    })
], ScraperModule);
//# sourceMappingURL=scraper.module.js.map
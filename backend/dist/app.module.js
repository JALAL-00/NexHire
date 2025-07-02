"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const recruiter_module_1 = require("./recruiter/recruiter.module");
const jobs_module_1 = require("./jobs/jobs.module");
const applications_module_1 = require("./applications/applications.module");
const candidate_module_1 = require("./candidate/candidate.module");
const scraper_module_1 = require("./scraper/scraper.module");
const screening_module_1 = require("./screening/screening.module");
const email_service_1 = require("./common/email.service");
const common_module_1 = require("./common/common.module");
const nexi_ai_module_1 = require("./nexi-ai/nexi-ai.module");
const chat_module_1 = require("./chat/chat.module");
const payments_module_1 = require("./payments/payments.module");
const posts_module_1 = require("./posts/posts.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const users_module_1 = require("./users/users.module");
const interviews_module_1 = require("./interviews/interviews.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DATABASE_HOST,
                port: +(process.env.DATABASE_PORT || '5432'),
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                autoLoadEntities: true,
                synchronize: true,
            }),
            auth_module_1.AuthModule,
            jobs_module_1.JobsModule,
            recruiter_module_1.RecruiterModule,
            candidate_module_1.CandidateModule,
            applications_module_1.ApplicationsModule,
            scraper_module_1.ScraperModule,
            screening_module_1.ScreeningModule,
            common_module_1.CommonModule,
            nexi_ai_module_1.NexiAiModule,
            chat_module_1.ChatModule,
            payments_module_1.PaymentsModule,
            posts_module_1.PostsModule,
            users_module_1.UsersModule,
            interviews_module_1.InterviewsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, email_service_1.EmailService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
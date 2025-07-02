"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
const user_entity_1 = require("./auth/entities/user.entity");
const message_entity_1 = require("./recruiter/entities/message.entity");
const job_entity_1 = require("./jobs/entities/job.entity");
const candidate_profile_entity_1 = require("./candidate/entities/candidate-profile.entity");
const screening_result_entity_1 = require("./screening/entities/screening-result.entity");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: configService.get('DB_HOST') || 'localhost',
    port: configService.get('DB_PORT') || 5432,
    username: configService.get('DB_USERNAME') || 'postgres',
    password: configService.get('DB_PASSWORD') || '46356',
    database: configService.get('DB_NAME') || 'job_db',
    entities: [user_entity_1.User, message_entity_1.Message, job_entity_1.Job, candidate_profile_entity_1.CandidateProfile, screening_result_entity_1.ScreeningResult],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map
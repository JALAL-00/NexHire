"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const candidate_controller_1 = require("./candidate.controller");
const candidate_service_1 = require("./candidate.service");
const candidate_profile_entity_1 = require("./entities/candidate-profile.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const jobs_service_1 = require("../jobs/jobs.service");
const email_service_1 = require("../common/email.service");
const applications_module_1 = require("../applications/applications.module");
let CandidateModule = class CandidateModule {
};
exports.CandidateModule = CandidateModule;
exports.CandidateModule = CandidateModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([candidate_profile_entity_1.CandidateProfile, user_entity_1.User, job_entity_1.Job]),
            applications_module_1.ApplicationsModule,
        ],
        controllers: [candidate_controller_1.CandidateController],
        providers: [candidate_service_1.CandidateService, jobs_service_1.JobsService, email_service_1.EmailService],
    })
], CandidateModule);
//# sourceMappingURL=candidate.module.js.map
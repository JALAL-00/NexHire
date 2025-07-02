"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruiterModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const recruiter_controller_1 = require("./recruiter.controller");
const recruiter_service_1 = require("./recruiter.service");
const job_entity_1 = require("../jobs/entities/job.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const message_entity_1 = require("./entities/message.entity");
const email_service_1 = require("../common/email.service");
const screening_result_entity_1 = require("../screening/entities/screening-result.entity");
const candidate_profile_entity_1 = require("../candidate/entities/candidate-profile.entity");
const recruiter_profile_entity_1 = require("./entities/recruiter-profile.entity");
const applications_module_1 = require("../applications/applications.module");
const auth_module_1 = require("../auth/auth.module");
const application_entity_1 = require("../applications/entities/application.entity");
const interview_entity_1 = require("../interviews/entities/interview.entity");
let RecruiterModule = class RecruiterModule {
};
exports.RecruiterModule = RecruiterModule;
exports.RecruiterModule = RecruiterModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                job_entity_1.Job,
                user_entity_1.User,
                message_entity_1.Message,
                application_entity_1.Application,
                interview_entity_1.Interview,
                screening_result_entity_1.ScreeningResult,
                candidate_profile_entity_1.CandidateProfile,
                recruiter_profile_entity_1.RecruiterProfile,
            ]),
            auth_module_1.AuthModule,
            applications_module_1.ApplicationsModule,
        ],
        controllers: [recruiter_controller_1.RecruiterController],
        providers: [recruiter_service_1.RecruiterService, email_service_1.EmailService],
    })
], RecruiterModule);
//# sourceMappingURL=recruiter.module.js.map
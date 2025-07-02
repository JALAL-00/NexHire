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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningController = void 0;
const common_1 = require("@nestjs/common");
const screening_service_1 = require("./screening.service");
const screen_job_dto_1 = require("./dto/screen-job.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const role_guard_1 = require("../auth/guards/role.guard");
const user_entity_1 = require("../auth/entities/user.entity");
let ScreeningController = class ScreeningController {
    screeningService;
    constructor(screeningService) {
        this.screeningService = screeningService;
    }
    async screenResumes(screenJobDto) {
        const results = await this.screeningService.screenResumes(screenJobDto.jobId);
        return results.map((result) => ({
            candidateId: result.candidate.id,
            candidateEmail: result.candidate.email,
            score: result.score,
            matchedKeywords: result.matchedKeywords,
        }));
    }
};
exports.ScreeningController = ScreeningController;
__decorate([
    (0, common_1.Post)('job'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [screen_job_dto_1.ScreenJobDto]),
    __metadata("design:returntype", Promise)
], ScreeningController.prototype, "screenResumes", null);
exports.ScreeningController = ScreeningController = __decorate([
    (0, common_1.Controller)('screening'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, common_1.SetMetadata)('role', user_entity_1.UserRole.RECRUITER),
    __metadata("design:paramtypes", [screening_service_1.ScreeningService])
], ScreeningController);
//# sourceMappingURL=screening.controller.js.map
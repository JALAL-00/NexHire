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
exports.ApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const applications_service_1 = require("./applications.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const role_guard_1 = require("../auth/guards/role.guard");
const user_entity_1 = require("../auth/entities/user.entity");
const update_application_status_dto_1 = require("./dto/update-application-status.dto");
let ApplicationsController = class ApplicationsController {
    applicationsService;
    constructor(applicationsService) {
        this.applicationsService = applicationsService;
    }
    findApplicationsByCandidate(req) {
        return this.applicationsService.findByCandidate(req.user.id);
    }
    findApplicationsByRecruiter(req) {
        return this.applicationsService.findByRecruiter(req.user.id);
    }
    findByJobForRecruiter(req, jobId) {
        return this.applicationsService.findByJobForRecruiter(req.user.id, jobId);
    }
    updateStatus(updateApplicationStatusDto) {
        return this.applicationsService.updateStatus(updateApplicationStatusDto.applicationId, updateApplicationStatusDto.status);
    }
    async findRecentApplicants(req) {
        const recruiterId = req.user.id;
        return this.applicationsService.findRecentApplicants(recruiterId);
    }
    async findShortlistedApplicants(req) {
        const recruiterId = req.user.id;
        return this.applicationsService.findShortlistedByRecruiter(recruiterId);
    }
};
exports.ApplicationsController = ApplicationsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.SetMetadata)('role', user_entity_1.UserRole.CANDIDATE),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "findApplicationsByCandidate", null);
__decorate([
    (0, common_1.Get)('job-applications'),
    (0, common_1.SetMetadata)('role', user_entity_1.UserRole.RECRUITER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "findApplicationsByRecruiter", null);
__decorate([
    (0, common_1.Get)('job/:jobId'),
    (0, common_1.SetMetadata)('role', user_entity_1.UserRole.RECRUITER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('jobId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "findByJobForRecruiter", null);
__decorate([
    (0, common_1.Patch)('status'),
    (0, common_1.SetMetadata)('role', user_entity_1.UserRole.RECRUITER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_application_status_dto_1.UpdateApplicationStatusDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('recent'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "findRecentApplicants", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('shortlisted'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "findShortlistedApplicants", null);
exports.ApplicationsController = ApplicationsController = __decorate([
    (0, common_1.Controller)('applications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    __metadata("design:paramtypes", [applications_service_1.ApplicationsService])
], ApplicationsController);
//# sourceMappingURL=applications.controller.js.map
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
exports.RecruiterController = void 0;
const common_1 = require("@nestjs/common");
const recruiter_service_1 = require("./recruiter.service");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const create_job_dto_1 = require("./dto/create-job.dto");
const update_job_dto_1 = require("./dto/update-job.dto");
const search_candidate_dto_1 = require("./dto/search-candidate.dto");
const send_message_dto_1 = require("./dto/send-message.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const role_guard_1 = require("../auth/guards/role.guard");
const user_entity_1 = require("../auth/entities/user.entity");
const auth_service_1 = require("../auth/auth.service");
let RecruiterController = class RecruiterController {
    recruiterService;
    authService;
    constructor(recruiterService, authService) {
        this.recruiterService = recruiterService;
        this.authService = authService;
    }
    getProfile(req) {
        return this.recruiterService.getProfile(req.user.id);
    }
    updateProfile(req, updateProfileDto) {
        return this.recruiterService.updateProfile(req.user.id, updateProfileDto);
    }
    async createJob(req, createJobDto) {
        const isPremium = await this.authService.isUserPremium(req.user.id);
        const existingJobsCount = await this.recruiterService.getJobsCount(req.user.id);
        if (existingJobsCount > 0 && !isPremium) {
            throw new common_1.ForbiddenException('You must upgrade to a premium plan to post more than one job.');
        }
        return this.recruiterService.createJob(req.user.id, createJobDto);
    }
    listAllJobs(req) {
        return this.recruiterService.listJobs(req.user.id);
    }
    listJobs(req, page = '1', limit = '10') {
        return this.recruiterService.listJobsPaginated(req.user.id, parseInt(page), parseInt(limit));
    }
    updateJob(req, updateJobDto) {
        const { jobId } = updateJobDto;
        return this.recruiterService.updateJob(req.user.id, jobId, updateJobDto);
    }
    deleteJob(req, { jobId }) {
        return this.recruiterService.deleteJob(req.user.id, jobId);
    }
    checkJobStatus(req) {
        return this.recruiterService.checkJobPostingStatus(req.user.id);
    }
    viewApplications(req, id) {
        return this.recruiterService.viewApplications(req.user.id, +id);
    }
    searchCandidates(searchCandidateDto) {
        return this.recruiterService.searchCandidates(searchCandidateDto);
    }
    sendMessage(req, sendMessageDto) {
        return this.recruiterService.sendMessage(req.user.id, sendMessageDto);
    }
    getDashboardStats(req) {
        const recruiterId = req.user.id;
        return this.recruiterService.getDashboardStats(recruiterId);
    }
};
exports.RecruiterController = RecruiterController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('jobs'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_job_dto_1.CreateJobDto]),
    __metadata("design:returntype", Promise)
], RecruiterController.prototype, "createJob", null);
__decorate([
    (0, common_1.Get)('jobs/all'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "listAllJobs", null);
__decorate([
    (0, common_1.Get)('jobs'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "listJobs", null);
__decorate([
    (0, common_1.Patch)('jobs'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_job_dto_1.UpdateJobDto]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "updateJob", null);
__decorate([
    (0, common_1.Delete)('jobs'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "deleteJob", null);
__decorate([
    (0, common_1.Get)('job-status'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "checkJobStatus", null);
__decorate([
    (0, common_1.Get)(':id/applications'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "viewApplications", null);
__decorate([
    (0, common_1.Post)('search-candidates'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_candidate_dto_1.SearchCandidateDto]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "searchCandidates", null);
__decorate([
    (0, common_1.Post)('messages'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('dashboard-stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "getDashboardStats", null);
exports.RecruiterController = RecruiterController = __decorate([
    (0, common_1.Controller)('recruiter'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, common_1.SetMetadata)('role', user_entity_1.UserRole.RECRUITER),
    __metadata("design:paramtypes", [recruiter_service_1.RecruiterService, auth_service_1.AuthService])
], RecruiterController);
//# sourceMappingURL=recruiter.controller.js.map
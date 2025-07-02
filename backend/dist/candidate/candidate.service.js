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
exports.CandidateService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const candidate_profile_entity_1 = require("./entities/candidate-profile.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const jobs_service_1 = require("../jobs/jobs.service");
const fs = require("fs/promises");
let CandidateService = class CandidateService {
    profileRepository;
    userRepository;
    jobRepository;
    jobsService;
    constructor(profileRepository, userRepository, jobRepository, jobsService) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.jobsService = jobsService;
    }
    async getProfile(userId) {
        const profile = await this.profileRepository.findOne({ where: { user: { id: userId } }, relations: ['user', 'savedJobs'] });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        return profile;
    }
    async updateProfile(userId, updateProfileDto) {
        let profile = await this.profileRepository.findOne({ where: { user: { id: userId } } });
        if (!profile) {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            profile = this.profileRepository.create({ user, ...updateProfileDto });
        }
        else {
            Object.assign(profile, updateProfileDto);
        }
        return this.profileRepository.save(profile);
    }
    async uploadResume(userId, file) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const filePath = file.path;
        user.resume = filePath;
        await this.userRepository.save(user);
        return { filePath };
    }
    async deleteResume(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || !user.resume) {
            throw new common_1.BadRequestException('No resume to delete');
        }
        try {
            await fs.unlink(user.resume);
        }
        catch (error) {
            console.error(`Failed to delete resume file at ${user.resume}: ${error.message}`);
        }
        user.resume = '';
        await this.userRepository.save(user);
        return { message: 'Resume deleted successfully' };
    }
    async searchJobs(searchJobsDto) {
        const result = await this.jobsService.findAll(searchJobsDto);
        return result.jobs;
    }
    async getSavedJobs(userId) {
        const profile = await this.profileRepository.findOne({
            where: { user: { id: userId } },
            relations: ['savedJobs', 'savedJobs.recruiter'],
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        return profile.savedJobs;
    }
    async saveJob(userId, jobId) {
        const profile = await this.profileRepository.findOne({
            where: { user: { id: userId } },
            relations: ['savedJobs'],
        });
        if (!profile)
            throw new common_1.NotFoundException('Profile not found');
        const job = await this.jobRepository.findOne({ where: { id: jobId } });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        const isAlreadySaved = profile.savedJobs.some((savedJob) => savedJob.id === jobId);
        if (!isAlreadySaved) {
            profile.savedJobs.push(job);
            await this.profileRepository.save(profile);
        }
        return profile;
    }
    async unsaveJob(userId, jobId) {
        const profile = await this.profileRepository.findOne({
            where: { user: { id: userId } },
            relations: ['savedJobs'],
        });
        if (!profile)
            throw new common_1.NotFoundException('Profile not found');
        profile.savedJobs = profile.savedJobs.filter((savedJob) => savedJob.id !== jobId);
        return this.profileRepository.save(profile);
    }
};
exports.CandidateService = CandidateService;
exports.CandidateService = CandidateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(candidate_profile_entity_1.CandidateProfile)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jobs_service_1.JobsService])
], CandidateService);
//# sourceMappingURL=candidate.service.js.map
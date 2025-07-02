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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const application_entity_1 = require("./entities/application.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const email_service_1 = require("../common/email.service");
let ApplicationsService = class ApplicationsService {
    applicationRepository;
    userRepository;
    jobRepository;
    emailService;
    findByRecruiter(id) {
        throw new Error('Method not implemented.');
    }
    findByJob(jobId) {
        throw new Error('Method not implemented.');
    }
    constructor(applicationRepository, userRepository, jobRepository, emailService) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.emailService = emailService;
    }
    async create(userId, createApplicationDto) {
        const { jobId, coverLetter, resume } = createApplicationDto;
        const candidate = await this.userRepository.findOne({ where: { id: userId } });
        const job = await this.jobRepository.findOne({ where: { id: jobId }, relations: ['recruiter'] });
        if (!candidate || !job) {
            throw new common_1.NotFoundException('Candidate or job not found');
        }
        const existingApplication = await this.applicationRepository.findOne({
            where: { candidate: { id: userId }, job: { id: jobId } },
        });
        if (existingApplication) {
            throw new common_1.ConflictException('You have already applied for this job.');
        }
        const application = this.applicationRepository.create({
            job: job,
            candidate: candidate,
            resume: resume,
            coverLetter: coverLetter,
            status: application_entity_1.ApplicationStatus.PENDING,
        });
        const savedApplication = await this.applicationRepository.save(application);
        await this.notifyRecruiter(job.recruiter.email, job.title, candidate.email);
        return savedApplication;
    }
    async findByCandidate(userId) {
        return this.applicationRepository.find({
            where: { candidate: { id: userId } },
            relations: ['job', 'job.recruiter'],
        });
    }
    async findByJobForRecruiter(recruiterId, jobId) {
        const job = await this.jobRepository.findOne({
            where: { id: jobId },
            relations: ['recruiter'],
        });
        if (!job) {
            throw new common_1.NotFoundException(`Job with ID ${jobId} not found.`);
        }
        if (job.recruiter.id !== recruiterId) {
            throw new common_1.UnauthorizedException('You are not authorized to view applications for this job.');
        }
        return this.applicationRepository.find({
            where: { job: { id: jobId } },
            relations: ['candidate', 'candidate.candidateProfile', 'job'],
        });
    }
    async getAllApplications(recruiterId) {
        return this.applicationRepository.find({
            where: { job: { recruiter: { id: recruiterId } } },
            relations: ['job', 'candidate'],
        });
    }
    async updateStatus(applicationId, status) {
        const application = await this.applicationRepository.findOne({
            where: { id: applicationId },
            relations: ['candidate', 'job'],
        });
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        application.status = status;
        const updatedApplication = await this.applicationRepository.save(application);
        await this.emailService.sendMail(application.candidate.email, `Application Status Update for ${application.job.title}`, `Your application for "${application.job.title}" has been updated to "${status}".`);
        return updatedApplication;
    }
    async notifyRecruiter(recruiterEmail, jobTitle, candidateEmail) {
        await this.emailService.sendMail(recruiterEmail, `New Application for ${jobTitle}`, `A candidate (${candidateEmail}) has applied for your job "${jobTitle}".`);
    }
    async findRecentApplicants(recruiterId, limit = 4) {
        return this.applicationRepository.find({
            where: { job: { recruiter: { id: recruiterId } } },
            relations: [
                'candidate',
                'candidate.candidateProfile',
            ],
            order: {
                createdAt: 'DESC',
            },
            take: limit,
        });
    }
    async findShortlistedByRecruiter(recruiterId) {
        return this.applicationRepository.find({
            where: {
                status: application_entity_1.ApplicationStatus.ACCEPTED,
                job: { recruiter: { id: recruiterId } },
            },
            relations: [
                'job',
                'candidate',
                'candidate.candidateProfile',
            ],
            order: {
                createdAt: 'DESC',
            },
        });
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map
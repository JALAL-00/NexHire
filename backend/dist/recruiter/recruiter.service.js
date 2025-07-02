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
exports.RecruiterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("../jobs/entities/job.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const message_entity_1 = require("./entities/message.entity");
const email_service_1 = require("../common/email.service");
const applications_service_1 = require("../applications/applications.service");
const screening_result_entity_1 = require("../screening/entities/screening-result.entity");
const candidate_profile_entity_1 = require("../candidate/entities/candidate-profile.entity");
const recruiter_profile_entity_1 = require("./entities/recruiter-profile.entity");
const application_entity_1 = require("../applications/entities/application.entity");
const interview_entity_1 = require("../interviews/entities/interview.entity");
let RecruiterService = class RecruiterService {
    jobRepository;
    userRepository;
    messageRepository;
    candidateProfileRepository;
    screeningResultRepository;
    recruiterProfileRepository;
    emailService;
    applicationsService;
    appRepo;
    interviewRepo;
    jobRepo;
    constructor(jobRepository, userRepository, messageRepository, candidateProfileRepository, screeningResultRepository, recruiterProfileRepository, emailService, applicationsService, appRepo, interviewRepo) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.screeningResultRepository = screeningResultRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.emailService = emailService;
        this.applicationsService = applicationsService;
        this.appRepo = appRepo;
        this.interviewRepo = interviewRepo;
    }
    async checkJobPostingStatus(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['postedJobs'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        if (user.isPremium) {
            return { canPost: true };
        }
        return { canPost: user.postedJobs.length < 1 };
    }
    async getJobsCount(recruiterId) {
        return this.jobRepository.count({ where: { recruiter: { id: recruiterId } } });
    }
    async getProfile(userId) {
        const profile = await this.recruiterProfileRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        return profile;
    }
    async updateProfile(userId, updateProfileDto) {
        let profile = await this.recruiterProfileRepository.findOne({ where: { user: { id: userId } } });
        if (!profile) {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            profile = this.recruiterProfileRepository.create({ user, ...updateProfileDto });
        }
        else {
            Object.assign(profile, updateProfileDto);
        }
        return this.recruiterProfileRepository.save(profile);
    }
    async listJobsPaginated(userId, page = 1, limit = 10) {
        const [jobs, totalCount] = await this.jobRepository.findAndCount({
            where: { recruiter: { id: userId } },
            relations: ['applications'],
            order: { id: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const formattedJobs = jobs.map(job => ({
            ...job,
            status: job.status || 'Active',
            applicationCount: job.applications?.length || 0,
        }));
        return {
            jobs: formattedJobs,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        };
    }
    async createJob(userId, createJobDto) {
        const recruiter = await this.userRepository.findOne({ where: { id: userId } });
        if (!recruiter) {
            throw new common_1.NotFoundException('Recruiter not found');
        }
        const job = this.jobRepository.create({ ...createJobDto, recruiter });
        return this.jobRepository.save(job);
    }
    async updateJob(userId, jobId, updateJobDto) {
        const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
        if (!job) {
            throw new common_1.NotFoundException('Job not found or not authorized');
        }
        const { jobId: _, ...updateData } = updateJobDto;
        Object.assign(job, updateData);
        return this.jobRepository.save(job);
    }
    async deleteJob(userId, jobId) {
        const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
        if (!job) {
            throw new common_1.NotFoundException('Job not found or not authorized');
        }
        await this.screeningResultRepository.delete({ job: { id: jobId } });
        await this.jobRepository.remove(job);
        return { message: 'Job deleted successfully' };
    }
    async listJobs(userId) {
        const jobs = await this.jobRepository.find({
            where: { recruiter: { id: userId } },
            relations: ['applications'],
            order: { id: 'DESC' },
        });
        return jobs.map(job => ({
            ...job,
            status: job.status || 'Active',
        }));
    }
    async viewApplications(userId, jobId) {
        const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
        if (!job) {
            throw new common_1.NotFoundException('Job not found or you are not authorized to view its applications.');
        }
        return this.applicationsService.findByJob(jobId);
    }
    async searchCandidates(searchCandidateDto) {
        const { title, skills, location } = searchCandidateDto;
        return this.candidateProfileRepository.find({
            where: {
                ...(title && { firstName: (0, typeorm_2.Like)(`%${title}%`) }),
                ...(skills && { skills: (0, typeorm_2.Like)(`%${skills}%`) }),
                ...(location && { phone: (0, typeorm_2.Like)(`%${location}%`) }),
            },
            relations: ['user'],
        });
    }
    async sendMessage(userId, sendMessageDto) {
        const { receiverId, content } = sendMessageDto;
        const sender = await this.userRepository.findOne({ where: { id: userId } });
        const receiver = await this.userRepository.findOne({ where: { id: receiverId, role: user_entity_1.UserRole.CANDIDATE } });
        if (!sender || !receiver) {
            throw new common_1.NotFoundException('Sender or receiver not found');
        }
        const message = this.messageRepository.create({ content, sender, receiver });
        await this.sendEmailNotification(receiver.email, 'New Message', `You received a message: ${content}`);
        return this.messageRepository.save(message);
    }
    async sendEmailNotification(email, subject, message) {
        console.log(`Sending email notification to: ${email}`);
        await this.emailService.sendMail(email, subject, message);
        console.log(`Email notification sent to ${email}`);
    }
    async notifyCandidates(job) {
        const candidates = await this.userRepository.find({ where: { role: user_entity_1.UserRole.CANDIDATE } });
        for (const candidate of candidates) {
            await this.sendEmailNotification(candidate.email, `New Job Opportunity: ${job.title}`, `A new job "${job.title}" has been posted. Location: ${job.location}, Salary: ${job.salary}.`);
        }
    }
    async getDashboardStats(recruiterId) {
        const [totalJobs, totalApplicants, totalShortlisted, totalInterviews] = await Promise.all([
            this.jobRepository.count({
                where: { recruiter: { id: recruiterId } },
            }),
            this.appRepo.count({
                where: { job: { recruiter: { id: recruiterId } } },
            }),
            this.appRepo.count({
                where: {
                    status: application_entity_1.ApplicationStatus.ACCEPTED,
                    job: { recruiter: { id: recruiterId } },
                },
            }),
            this.interviewRepo.count({
                where: { application: { job: { recruiter: { id: recruiterId } } } },
            }),
        ]);
        return {
            totalJobs,
            totalApplicants,
            totalShortlisted,
            totalInterviews,
        };
    }
};
exports.RecruiterService = RecruiterService;
exports.RecruiterService = RecruiterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(3, (0, typeorm_1.InjectRepository)(candidate_profile_entity_1.CandidateProfile)),
    __param(4, (0, typeorm_1.InjectRepository)(screening_result_entity_1.ScreeningResult)),
    __param(5, (0, typeorm_1.InjectRepository)(recruiter_profile_entity_1.RecruiterProfile)),
    __param(8, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(9, (0, typeorm_1.InjectRepository)(interview_entity_1.Interview)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService,
        applications_service_1.ApplicationsService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RecruiterService);
//# sourceMappingURL=recruiter.service.js.map
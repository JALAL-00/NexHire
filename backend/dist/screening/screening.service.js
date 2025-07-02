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
exports.ScreeningService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const screening_result_entity_1 = require("./entities/screening-result.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const application_entity_1 = require("../applications/entities/application.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const email_service_1 = require("../common/email.service");
const resume_parser_util_1 = require("../common/resume-parser.util");
let ScreeningService = class ScreeningService {
    screeningResultRepository;
    jobRepository;
    applicationRepository;
    userRepository;
    emailService;
    constructor(screeningResultRepository, jobRepository, applicationRepository, userRepository, emailService) {
        this.screeningResultRepository = screeningResultRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    buildJobProfileText(job) {
        return {
            skillsText: (job.skills?.join(' ') || '').toLowerCase(),
            experienceText: (job.experience || '').toLowerCase(),
            descriptionText: [job.description, job.responsibilities].filter(Boolean).join(' ').toLowerCase(),
            educationText: (job.education || '').toLowerCase(),
            otherText: [job.title, job.location, job.jobType, job.jobLevel, job.salary]
                .filter(Boolean)
                .join(' ')
                .toLowerCase(),
        };
    }
    tokenize(text) {
        return text.toLowerCase().split(/\W+/).map(w => w.trim()).filter(Boolean);
    }
    async screenResumes(jobId) {
        const job = await this.jobRepository.findOne({
            where: { id: jobId },
            relations: ['recruiter'],
        });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        const applications = await this.applicationRepository.find({
            where: { job: { id: jobId } },
            relations: ['candidate'],
        });
        if (!applications.length)
            throw new common_1.NotFoundException('No applications found for this job');
        const results = [];
        const { skillsText, experienceText, descriptionText, educationText, otherText } = this.buildJobProfileText(job);
        const skillsKeywords = Array.from(new Set(this.tokenize(skillsText)));
        const experienceKeywords = Array.from(new Set(this.tokenize(experienceText)));
        const descriptionKeywords = Array.from(new Set(this.tokenize(descriptionText)));
        const educationKeywords = Array.from(new Set(this.tokenize(educationText)));
        const otherKeywords = Array.from(new Set(this.tokenize(otherText)));
        for (const application of applications) {
            if (!application.resume)
                continue;
            try {
                const resumeText = await resume_parser_util_1.ResumeParser.parseResume(application.resume);
                const resumeWords = new Set(this.tokenize(resumeText));
                const matchedSkills = skillsKeywords.filter(word => resumeWords.has(word));
                const matchedExperience = experienceKeywords.filter(word => resumeWords.has(word));
                const matchedDescription = descriptionKeywords.filter(word => resumeWords.has(word));
                const matchedEducation = educationKeywords.filter(word => resumeWords.has(word));
                const matchedOther = otherKeywords.filter(word => resumeWords.has(word));
                const skillsScore = skillsKeywords.length
                    ? (matchedSkills.length / skillsKeywords.length) * 50
                    : 0;
                const experienceScore = experienceKeywords.length
                    ? (matchedExperience.length / experienceKeywords.length) * 15
                    : 0;
                const descriptionScore = descriptionKeywords.length
                    ? (matchedDescription.length / descriptionKeywords.length) * 15
                    : 0;
                const educationScore = educationKeywords.length
                    ? (matchedEducation.length / educationKeywords.length) * 15
                    : 0;
                const otherScore = otherKeywords.length
                    ? (matchedOther.length / otherKeywords.length) * 5
                    : 0;
                const totalScore = skillsScore + experienceScore + descriptionScore + educationScore + otherScore;
                const matchedKeywords = [
                    ...matchedSkills,
                    ...matchedExperience,
                    ...matchedDescription,
                    ...matchedEducation,
                    ...matchedOther,
                ];
                const result = this.screeningResultRepository.create({
                    job,
                    candidate: application.candidate,
                    score: totalScore,
                    matchedKeywords,
                });
                results.push(await this.screeningResultRepository.save(result));
            }
            catch (error) {
                console.error(`Failed to process resume for candidate ${application.candidate.id}: ${error.message}`);
            }
        }
        if (results.length > 0) {
            const topCandidate = results[0];
            await this.emailService.sendMail(job.recruiter.email, `Screening Results for Job: ${job.title}`, `Screening completed for "${job.title}".\n\nTop candidate scored ${topCandidate.score.toFixed(2)}%.\nMatched keywords: ${topCandidate.matchedKeywords.join(', ')}`);
        }
        return results.sort((a, b) => b.score - a.score);
    }
};
exports.ScreeningService = ScreeningService;
exports.ScreeningService = ScreeningService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(screening_result_entity_1.ScreeningResult)),
    __param(1, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(2, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], ScreeningService);
//# sourceMappingURL=screening.service.js.map
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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("./entities/job.entity");
let JobsService = class JobsService {
    jobRepository;
    constructor(jobRepository) {
        this.jobRepository = jobRepository;
    }
    async findLatest(limit = 2) {
        try {
            return await this.jobRepository.find({
                order: { createdAt: 'DESC' },
                take: limit,
                relations: ['recruiter'],
            });
        }
        catch (error) {
            console.error("Error fetching latest jobs:", error);
            throw new common_1.InternalServerErrorException('Error fetching job recommendations');
        }
    }
    async findAll(listJobsDto) {
        try {
            const { location, skills, salary, jobTitle, jobType, page = 1, limit = 10 } = listJobsDto;
            const queryBuilder = this.jobRepository.createQueryBuilder('job');
            queryBuilder.leftJoinAndSelect('job.recruiter', 'recruiter');
            if (jobTitle) {
                queryBuilder.andWhere('job.title ILIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
            }
            if (location) {
                queryBuilder.andWhere('job.location ILIKE :location', { location: `%${location}%` });
            }
            if (salary) {
                queryBuilder.andWhere('job.salary LIKE :salary', { salary: `%${salary}%` });
            }
            if (jobType && jobType.length > 0) {
                const types = Array.isArray(jobType) ? jobType : [jobType];
                queryBuilder.andWhere('job.jobType IN (:...types)', { types });
            }
            if (skills && skills.length > 0) {
                skills.forEach((skill, index) => {
                    queryBuilder.andWhere(`job.skills LIKE :skill${index}`, {
                        [`skill${index}`]: `%${skill}%`,
                    });
                });
            }
            queryBuilder.skip((page - 1) * limit).take(limit);
            const [jobs, totalCount] = await queryBuilder.getManyAndCount();
            return {
                jobs,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
            };
        }
        catch (error) {
            console.error("Error fetching job listings:", error);
            throw new common_1.InternalServerErrorException('Error fetching job listings');
        }
    }
    async findOne(id) {
        try {
            const job = await this.jobRepository.findOne({
                where: { id },
                relations: ['recruiter']
            });
            if (!job) {
                throw new common_1.NotFoundException(`Job with ID ${id} not found`);
            }
            return job;
        }
        catch (error) {
            console.error("Error fetching job:", error);
            throw new common_1.InternalServerErrorException('Error fetching job');
        }
    }
    async countJobsByRecruiter(recruiterId) {
        try {
            const count = await this.jobRepository.count({
                where: { recruiter: { id: recruiterId } },
            });
            return count;
        }
        catch (error) {
            console.error(`Error counting jobs for recruiter ${recruiterId}:`, error);
            throw new common_1.InternalServerErrorException('Could not retrieve job count.');
        }
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], JobsService);
//# sourceMappingURL=jobs.service.js.map
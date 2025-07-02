import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { ListJobsDto } from './dto/list-jobs.dto';
export declare class JobsService {
    private jobRepository;
    constructor(jobRepository: Repository<Job>);
    findLatest(limit?: number): Promise<Job[]>;
    findAll(listJobsDto: ListJobsDto): Promise<{
        jobs: Job[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
    }>;
    findOne(id: number): Promise<Job>;
    countJobsByRecruiter(recruiterId: number): Promise<number>;
}

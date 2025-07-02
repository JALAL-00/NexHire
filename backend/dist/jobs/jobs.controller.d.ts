import { JobsService } from './jobs.service';
import { ListJobsDto } from './dto/list-jobs.dto';
import { RequestWithUser } from '../common/types/request-with-user.interface';
export declare class JobsController {
    private jobsService;
    constructor(jobsService: JobsService);
    getMyJobsCount(req: RequestWithUser): Promise<{
        count: number;
    }>;
    findRecommendations(limit?: string): Promise<import("./entities/job.entity").Job[]>;
    findOne(id: string): Promise<import("./entities/job.entity").Job>;
    findAll(listJobsDto: ListJobsDto): Promise<{
        jobs: import("./entities/job.entity").Job[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
    }>;
}

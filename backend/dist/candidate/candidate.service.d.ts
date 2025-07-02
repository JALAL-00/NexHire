import { Repository } from 'typeorm';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { User } from '../auth/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { JobsService } from '../jobs/jobs.service';
export declare class CandidateService {
    private profileRepository;
    private userRepository;
    private jobRepository;
    private jobsService;
    constructor(profileRepository: Repository<CandidateProfile>, userRepository: Repository<User>, jobRepository: Repository<Job>, jobsService: JobsService);
    getProfile(userId: number): Promise<CandidateProfile>;
    updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<CandidateProfile>;
    uploadResume(userId: number, file: Express.Multer.File): Promise<{
        filePath: string;
    }>;
    deleteResume(userId: number): Promise<{
        message: string;
    }>;
    searchJobs(searchJobsDto: SearchJobsDto): Promise<Job[]>;
    getSavedJobs(userId: number): Promise<Job[]>;
    saveJob(userId: number, jobId: number): Promise<CandidateProfile>;
    unsaveJob(userId: number, jobId: number): Promise<CandidateProfile>;
}

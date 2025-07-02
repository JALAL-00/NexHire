import { CandidateService } from './candidate.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { CreateApplicationDto } from '../applications/dto/create-application.dto';
import { ApplicationsService } from '../applications/applications.service';
export declare class CandidateController {
    private candidateService;
    private applicationsService;
    constructor(candidateService: CandidateService, applicationsService: ApplicationsService);
    getProfile(req: any): Promise<import("./entities/candidate-profile.entity").CandidateProfile>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<import("./entities/candidate-profile.entity").CandidateProfile>;
    uploadResume(req: any, file: Express.Multer.File): Promise<{
        filePath: string;
    }>;
    deleteResume(req: any): Promise<{
        message: string;
    }>;
    searchJobs(searchJobsDto: SearchJobsDto): Promise<import("../jobs/entities/job.entity").Job[]>;
    applyJob(req: any, createApplicationDto: CreateApplicationDto): Promise<import("../applications/entities/application.entity").Application>;
    getSavedJobs(req: any): Promise<import("../jobs/entities/job.entity").Job[]>;
    saveJob(req: any, jobId: number): Promise<import("./entities/candidate-profile.entity").CandidateProfile>;
    unsaveJob(req: any, jobId: number): Promise<import("./entities/candidate-profile.entity").CandidateProfile>;
}

import { RecruiterService } from './recruiter.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SearchCandidateDto } from './dto/search-candidate.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { RequestWithUser } from '../common/types/request-with-user.interface';
import { AuthService } from 'src/auth/auth.service';
export declare class RecruiterController {
    private recruiterService;
    private readonly authService;
    constructor(recruiterService: RecruiterService, authService: AuthService);
    getProfile(req: RequestWithUser): Promise<import("./entities/recruiter-profile.entity").RecruiterProfile>;
    updateProfile(req: RequestWithUser, updateProfileDto: UpdateProfileDto): Promise<import("./entities/recruiter-profile.entity").RecruiterProfile>;
    createJob(req: RequestWithUser, createJobDto: CreateJobDto): Promise<import("../jobs/entities/job.entity").Job>;
    listAllJobs(req: RequestWithUser): Promise<import("../jobs/entities/job.entity").Job[]>;
    listJobs(req: RequestWithUser, page?: string, limit?: string): Promise<{
        jobs: import("../jobs/entities/job.entity").Job[];
        totalCount: number;
        totalPages: number;
    }>;
    updateJob(req: RequestWithUser, updateJobDto: UpdateJobDto): Promise<import("../jobs/entities/job.entity").Job>;
    deleteJob(req: RequestWithUser, { jobId }: {
        jobId: number;
    }): Promise<{
        message: string;
    }>;
    checkJobStatus(req: RequestWithUser): Promise<{
        canPost: boolean;
    }>;
    viewApplications(req: RequestWithUser, id: string): Promise<import("../applications/entities/application.entity").Application[]>;
    searchCandidates(searchCandidateDto: SearchCandidateDto): Promise<import("../candidate/entities/candidate-profile.entity").CandidateProfile[]>;
    sendMessage(req: RequestWithUser, sendMessageDto: SendMessageDto): Promise<import("./entities/message.entity").Message>;
    getDashboardStats(req: RequestWithUser): Promise<{
        totalJobs: number;
        totalApplicants: number;
        totalShortlisted: number;
        totalInterviews: number;
    }>;
}

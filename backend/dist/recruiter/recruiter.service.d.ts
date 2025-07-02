import { Repository } from 'typeorm';
import { Job } from '../jobs/entities/job.entity';
import { User } from '../auth/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SearchCandidateDto } from './dto/search-candidate.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { Message } from './entities/message.entity';
import { EmailService } from '../common/email.service';
import { ApplicationsService } from '../applications/applications.service';
import { ScreeningResult } from '../screening/entities/screening-result.entity';
import { CandidateProfile } from '../candidate/entities/candidate-profile.entity';
import { RecruiterProfile } from './entities/recruiter-profile.entity';
import { Application } from '../applications/entities/application.entity';
import { Interview } from 'src/interviews/entities/interview.entity';
export declare class RecruiterService {
    private jobRepository;
    private userRepository;
    private messageRepository;
    private candidateProfileRepository;
    private screeningResultRepository;
    private recruiterProfileRepository;
    private emailService;
    private applicationsService;
    private readonly appRepo;
    private readonly interviewRepo;
    jobRepo: any;
    constructor(jobRepository: Repository<Job>, userRepository: Repository<User>, messageRepository: Repository<Message>, candidateProfileRepository: Repository<CandidateProfile>, screeningResultRepository: Repository<ScreeningResult>, recruiterProfileRepository: Repository<RecruiterProfile>, emailService: EmailService, applicationsService: ApplicationsService, appRepo: Repository<Application>, interviewRepo: Repository<Interview>);
    checkJobPostingStatus(userId: number): Promise<{
        canPost: boolean;
    }>;
    getJobsCount(recruiterId: number): Promise<number>;
    getProfile(userId: number): Promise<RecruiterProfile>;
    updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<RecruiterProfile>;
    listJobsPaginated(userId: number, page?: number, limit?: number): Promise<{
        jobs: Job[];
        totalCount: number;
        totalPages: number;
    }>;
    createJob(userId: number, createJobDto: CreateJobDto): Promise<Job>;
    updateJob(userId: number, jobId: number, updateJobDto: UpdateJobDto): Promise<Job>;
    deleteJob(userId: number, jobId: number): Promise<{
        message: string;
    }>;
    listJobs(userId: number): Promise<Job[]>;
    viewApplications(userId: number, jobId: number): Promise<Application[]>;
    searchCandidates(searchCandidateDto: SearchCandidateDto): Promise<CandidateProfile[]>;
    sendMessage(userId: number, sendMessageDto: SendMessageDto): Promise<Message>;
    private sendEmailNotification;
    private notifyCandidates;
    getDashboardStats(recruiterId: number): Promise<{
        totalJobs: number;
        totalApplicants: number;
        totalShortlisted: number;
        totalInterviews: number;
    }>;
}

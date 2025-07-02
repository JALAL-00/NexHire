import { Repository } from 'typeorm';
import { ScreeningResult } from './entities/screening-result.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { User } from '../auth/entities/user.entity';
import { EmailService } from '../common/email.service';
export declare class ScreeningService {
    private screeningResultRepository;
    private jobRepository;
    private applicationRepository;
    private userRepository;
    private emailService;
    constructor(screeningResultRepository: Repository<ScreeningResult>, jobRepository: Repository<Job>, applicationRepository: Repository<Application>, userRepository: Repository<User>, emailService: EmailService);
    private buildJobProfileText;
    private tokenize;
    screenResumes(jobId: number): Promise<ScreeningResult[]>;
}

import { User } from '../../auth/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';
import { Interview } from '../../interviews/entities/interview.entity';
export declare enum ApplicationStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected"
}
export declare class Application {
    id: number;
    job: Job;
    candidate: User;
    interviews: Interview[];
    resume: string;
    coverLetter: string;
    status: ApplicationStatus;
    createdAt: Date;
}

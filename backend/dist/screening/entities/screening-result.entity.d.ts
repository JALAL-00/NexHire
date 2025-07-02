export declare class ScreeningResultEntity {
}
import { Job } from '../../jobs/entities/job.entity';
import { User } from '../../auth/entities/user.entity';
export declare class ScreeningResult {
    id: number;
    job: Job;
    candidate: User;
    score: number;
    matchedKeywords: string[];
    createdAt: Date;
}

import { CandidateProfile } from '../../candidate/entities/candidate-profile.entity';
import { Job } from '../../jobs/entities/job.entity';
import { Application } from '../../applications/entities/application.entity';
import { Message } from '../../recruiter/entities/message.entity';
import { ScrapedJob } from '../../scraper/entities/scraped-job.entity';
import { RecruiterProfile } from '../../recruiter/entities/recruiter-profile.entity';
import { Post } from '../../posts/entities/post.entity';
export declare enum UserRole {
    RECRUITER = "recruiter",
    CANDIDATE = "candidate"
}
export declare class User {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName: string;
    phone: string;
    role: UserRole;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    isPremium: boolean;
    resume: string;
    candidateProfile: CandidateProfile;
    recruiterProfile: RecruiterProfile;
    jobs: Job[];
    applications: Application[];
    sentMessages: Message[];
    receivedMessages: Message[];
    scrapedJobs: ScrapedJob[];
    posts: Post[];
    postedJobs: Job[];
}

import { User } from '../../auth/entities/user.entity';
import { Application } from '../../applications/entities/application.entity';
export declare class Job {
    id: number;
    title: string;
    description: string;
    location: string;
    salary: string;
    skills: string[];
    experience: string;
    recruiter: User;
    applications: Application[];
    responsibilities: string;
    expirationDate: string;
    jobType: string;
    jobLevel: string;
    education: string;
    createdAt: Date;
    status: string;
}

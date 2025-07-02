import { User } from '../../auth/entities/user.entity';
import { Job } from 'src/jobs/entities/job.entity';
interface ExperienceEntry {
    title: string;
    org: string;
    duration: string;
    location: string;
    desc: string;
}
export declare class CandidateProfile {
    id: number;
    user: User;
    title: string;
    availability: string;
    location: string;
    about: string;
    services: string;
    skills: string[];
    experience: ExperienceEntry[];
    education: {
        institution: string;
        degree: string;
        year: number;
    }[];
    resume: string;
    isVisible: boolean;
    profilePicture: string;
    coverPhoto: string;
    savedJobs: Job[];
}
export {};

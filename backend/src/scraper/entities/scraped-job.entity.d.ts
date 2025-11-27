import { User } from '../../auth/entities/user.entity';
export declare class ScrapedJob {
    id: number;
    title: string;
    company: string;
    location: string;
    description: string;
    salary?: string;
    postedDate?: string;
    url: string;
    source: string;
    user: User;
}

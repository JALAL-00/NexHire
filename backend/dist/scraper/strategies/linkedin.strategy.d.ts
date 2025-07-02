import { JobData } from '../interfaces/job-data.interface';
export declare class LinkedinStrategy {
    scrape(params: {
        searchTerm: string;
        location?: string;
        limit?: number;
    }): Promise<JobData[]>;
}

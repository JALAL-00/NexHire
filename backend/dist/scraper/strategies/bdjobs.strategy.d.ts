import { JobData } from "../interfaces/job-data.interface";
export declare class BdjobsStrategy {
    private readonly logger;
    scrape(params: {
        searchTerm: string;
        location?: string;
        limit?: number;
    }): Promise<JobData[]>;
}

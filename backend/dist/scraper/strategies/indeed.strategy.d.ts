import { JobData } from "../interfaces/job-data.interface";
export declare class IndeedStrategy {
    private readonly logger;
    scrape(params: {
        searchTerm: string;
        location?: string;
        limit?: number;
    }): Promise<JobData[]>;
}

import { ApplicationsService } from './applications.service';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';
export declare class ApplicationsController {
    private applicationsService;
    constructor(applicationsService: ApplicationsService);
    findApplicationsByCandidate(req: any): Promise<import("./entities/application.entity").Application[]>;
    findApplicationsByRecruiter(req: any): void;
    findByJobForRecruiter(req: any, jobId: number): Promise<import("./entities/application.entity").Application[]>;
    updateStatus(updateApplicationStatusDto: UpdateApplicationStatusDto): Promise<import("./entities/application.entity").Application>;
    findRecentApplicants(req: RequestWithUser): Promise<import("./entities/application.entity").Application[]>;
    findShortlistedApplicants(req: RequestWithUser): Promise<import("./entities/application.entity").Application[]>;
}

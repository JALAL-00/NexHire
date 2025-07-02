import { ScreeningService } from './screening.service';
import { ScreenJobDto } from './dto/screen-job.dto';
export declare class ScreeningController {
    private screeningService;
    constructor(screeningService: ScreeningService);
    screenResumes(screenJobDto: ScreenJobDto): Promise<any[]>;
}

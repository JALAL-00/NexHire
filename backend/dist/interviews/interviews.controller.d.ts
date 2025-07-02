import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';
export declare class InterviewsController {
    private readonly interviewsService;
    constructor(interviewsService: InterviewsService);
    create(createInterviewDto: CreateInterviewDto): Promise<import("./entities/interview.entity").Interview>;
    findAll(req: RequestWithUser): Promise<import("./entities/interview.entity").Interview[]>;
    remove(id: number): Promise<void>;
}

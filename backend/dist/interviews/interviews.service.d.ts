import { Repository } from 'typeorm';
import { Interview } from './entities/interview.entity';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { Application } from 'src/applications/entities/application.entity';
export declare class InterviewsService {
    private interviewRepo;
    private appRepo;
    constructor(interviewRepo: Repository<Interview>, appRepo: Repository<Application>);
    create(dto: CreateInterviewDto): Promise<Interview>;
    findAllForRecruiter(recruiterId: number): Promise<Interview[]>;
    remove(id: number): Promise<void>;
}

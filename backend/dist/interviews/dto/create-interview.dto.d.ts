import { InterviewType } from '../entities/interview.entity';
export declare class CreateInterviewDto {
    applicationId: number;
    title: string;
    date: string;
    type: InterviewType;
    locationOrLink?: string;
    notes?: string;
}

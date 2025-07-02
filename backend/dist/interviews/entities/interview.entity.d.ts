import { Application } from 'src/applications/entities/application.entity';
export declare enum InterviewType {
    VIDEO_CALL = "Video Call",
    PHONE_SCREEN = "Phone Screen",
    ON_SITE = "On-site"
}
export declare class Interview {
    id: number;
    title: string;
    date: Date;
    type: InterviewType;
    locationOrLink: string;
    notes: string;
    application: Application;
}

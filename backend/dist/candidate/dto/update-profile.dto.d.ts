declare class ExperienceEntryDto {
    title: string;
    org: string;
    duration: string;
    location: string;
    desc: string;
}
export declare class UpdateProfileDto {
    title?: string;
    availability?: string;
    location?: string;
    about?: string;
    services?: string;
    skills?: string[];
    experience?: ExperienceEntryDto[];
    education?: {
        institution: string;
        degree: string;
        year: number;
    }[];
    isVisible?: boolean;
}
export {};

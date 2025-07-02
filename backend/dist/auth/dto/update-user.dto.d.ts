declare class ExperienceEntryDto {
    title: string;
    org: string;
    duration: string;
    location: string;
    desc: string;
}
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    title?: string;
    experience?: ExperienceEntryDto[];
    education?: any[];
    companyName?: string;
    designation?: string;
    phone?: string;
    website?: string;
    location?: string;
    about?: string;
}
export {};

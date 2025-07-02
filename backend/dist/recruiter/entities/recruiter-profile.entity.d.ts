import { User } from '../../auth/entities/user.entity';
export declare class RecruiterProfile {
    id: number;
    user: User;
    companyName: string;
    designation: string;
    firstName: string;
    lastName: string;
    phone: string;
    website: string;
    profilePicture: string;
    coverPhoto: string;
    about: string;
    location: string;
}

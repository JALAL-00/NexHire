import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRole } from './entities/user.entity';
import { RequestWithUser } from '../common/types/request-with-user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: RequestWithUser, res: Response): Promise<void>;
    register(registerDto: RegisterDto): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        companyName: string;
        phone: string;
        role: UserRole;
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
        isPremium: boolean;
        resume: string;
        candidateProfile: import("../candidate/entities/candidate-profile.entity").CandidateProfile;
        recruiterProfile: import("../recruiter/entities/recruiter-profile.entity").RecruiterProfile;
        jobs: import("../jobs/entities/job.entity").Job[];
        applications: import("../applications/entities/application.entity").Application[];
        sentMessages: import("../recruiter/entities/message.entity").Message[];
        receivedMessages: import("../recruiter/entities/message.entity").Message[];
        scrapedJobs: import("../scraper/entities/scraped-job.entity").ScrapedJob[];
        posts: import("../posts/entities/post.entity").Post[];
        postedJobs: import("../jobs/entities/job.entity").Job[];
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    logout(token: string): Promise<{
        message: string;
    }>;
    deleteAccount(req: RequestWithUser): Promise<{
        message: string;
    }>;
    updateUserInfo(req: RequestWithUser, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
    getProfile(req: RequestWithUser): Promise<any>;
    uploadProfilePicture(req: RequestWithUser, file: Express.Multer.File): Promise<{
        message: string;
        filePath: string;
    }>;
    uploadCoverPhoto(req: RequestWithUser, file: Express.Multer.File): Promise<{
        message: string;
        filePath: string;
    }>;
}

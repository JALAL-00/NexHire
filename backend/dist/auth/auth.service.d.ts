import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { Message } from '../recruiter/entities/message.entity';
import { CandidateProfile } from '../candidate/entities/candidate-profile.entity';
import { RecruiterProfile } from '../recruiter/entities/recruiter-profile.entity';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class AuthService {
    private userRepository;
    private jobRepository;
    private applicationRepository;
    private messageRepository;
    private candidateProfileRepository;
    private recruiterProfileRepository;
    private jwtService;
    private readonly blockedEmailDomains;
    constructor(userRepository: Repository<User>, jobRepository: Repository<Job>, applicationRepository: Repository<Application>, messageRepository: Repository<Message>, candidateProfileRepository: Repository<CandidateProfile>, recruiterProfileRepository: Repository<RecruiterProfile>, jwtService: JwtService);
    updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User>;
    isUserPremium(userId: number): Promise<boolean>;
    getProfile(userId: number): Promise<any>;
    updateProfileImage(user: User, imageType: 'profilePicture' | 'coverPhoto', filePath: string): Promise<{
        message: string;
        filePath: string;
    }>;
    handleGoogleAuth(profile: {
        email: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        action: 'login' | 'register';
    }): Promise<{
        user: User;
        token: string;
    }>;
    register(registerDto: RegisterDto): Promise<User>;
    validateUser(email: string, password: string): Promise<User | null>;
    login(user: User): Promise<{
        access_token: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    logout(token: string): Promise<void>;
    deleteAccount(userId: number): Promise<{
        message: string;
    }>;
    validateUserFromPayload(payload: {
        sub: number;
        email: string;
    }): Promise<User | null>;
}

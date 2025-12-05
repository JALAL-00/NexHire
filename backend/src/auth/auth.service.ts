import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { Message } from '../recruiter/entities/message.entity';
import { Message as ChatMessage } from '../chat/entities/message.entity';
import { Conversation } from '../chat/entities/conversation.entity';
import { ScrapedJob } from '../scraper/entities/scraped-job.entity';
import { Post } from '../posts/entities/post.entity';
import { ScreeningResult } from '../screening/entities/screening-result.entity';
import { CandidateProfile } from '../candidate/entities/candidate-profile.entity';
import { RecruiterProfile } from '../recruiter/entities/recruiter-profile.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '../common/email.service';

@Injectable()
export class AuthService {
  private readonly blockedEmailDomains = [
    'example.com',
    'mailinator.com',
    'tempmail.com',
    'guerrillamail.com',
    '10minutemail.com',
  ];

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(ScrapedJob)
    private scrapedJobRepository: Repository<ScrapedJob>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(ScreeningResult)
    private screeningResultRepository: Repository<ScreeningResult>,
    @InjectRepository(CandidateProfile)
    private candidateProfileRepository: Repository<CandidateProfile>,
    @InjectRepository(RecruiterProfile)
    private recruiterProfileRepository: Repository<RecruiterProfile>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) { }



  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const {
      firstName,
      lastName,
      phone,
      ...profileData
    } = updateUserDto as any;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['candidateProfile', 'recruiterProfile'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const coreUpdates: Partial<User> = {};
    if (firstName !== undefined) coreUpdates.firstName = firstName;
    if (lastName !== undefined) coreUpdates.lastName = lastName;
    if (phone !== undefined) coreUpdates.phone = phone;

    if (Object.keys(coreUpdates).length > 0) {
      await this.userRepository.update(userId, coreUpdates);
    }

    const validProfileData = Object.entries(profileData).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    if (user.role === UserRole.CANDIDATE && user.candidateProfile) {
      if (Object.keys(validProfileData).length > 0) {
        await this.candidateProfileRepository.update({ id: user.candidateProfile.id }, validProfileData);
      }
    } else if (user.role === UserRole.RECRUITER && user.recruiterProfile) {

      if (Object.keys(validProfileData).length > 0) {
        await this.recruiterProfileRepository.update({ id: user.recruiterProfile.id }, validProfileData);
      }
    }

    return this.getProfile(userId);
  }

  async isUserPremium(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['isPremium'],
    });
    if (!user) {
      return false;
    }
    return user.isPremium;
  }

  async getProfile(userId: number): Promise<any> {

    let user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'candidateProfile',
        'recruiterProfile',
        'candidateProfile.savedJobs',
        'applications',
        'applications.job'
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.CANDIDATE && !user.candidateProfile) {

      const newProfile = this.candidateProfileRepository.create({ user, experience: [], education: [], savedJobs: [] });
      await this.candidateProfileRepository.save(newProfile);
      user.candidateProfile = newProfile;
    } else if (user.role === UserRole.RECRUITER && !user.recruiterProfile) {
      const newProfile = this.recruiterProfileRepository.create({ user, companyName: user.companyName || 'N/A' });
      await this.recruiterProfileRepository.save(newProfile);
      user.recruiterProfile = newProfile;
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }


  async updateProfileImage(user: User, imageType: 'profilePicture' | 'coverPhoto', filePath: string) {
    if (!imageType) {
      throw new BadRequestException('imageType (profilePicture or coverPhoto) is required.');
    }
    const finalPath = filePath.replace(/\\/g, '/').split('uploads/')[1];
    if (!finalPath) {
      throw new InternalServerErrorException('Could not determine file path after upload.');
    }
    try {
      if (user.role === UserRole.CANDIDATE) {
        const profile = await this.candidateProfileRepository.findOneBy({ user: { id: user.id } });
        if (!profile) throw new NotFoundException('Candidate profile not found.');
        await this.candidateProfileRepository.update(
          { id: profile.id },
          { [imageType]: finalPath }
        );
      } else if (user.role === UserRole.RECRUITER) {
        const profile = await this.recruiterProfileRepository.findOneBy({ user: { id: user.id } });
        if (!profile) throw new NotFoundException('Recruiter profile not found.');
        await this.recruiterProfileRepository.update(
          { id: profile.id },
          { [imageType]: finalPath }
        );
      } else {
        throw new NotFoundException('User profile type not found.');
      }
      return { message: 'Image uploaded successfully', filePath: finalPath };
    } catch (error) {
      console.error("Failed to update profile image path:", error);
      throw new InternalServerErrorException("Could not update profile image.");
    }
  }

  async handleGoogleAuth(profile: { email: string; firstName: string; lastName: string; role: UserRole; action: 'login' | 'register' }): Promise<{ user: User; token: string }> {
    const { email, firstName, lastName, role, action } = profile;

    const existingUser = await this.userRepository.findOne({ where: { email } });

    if (action === 'login') {

      if (!existingUser) {
        throw new BadRequestException('Account not found. Please register first.');
      }

      const jwtPayload = { email: existingUser.email, sub: existingUser.id, role: existingUser.role };
      const token = this.jwtService.sign(jwtPayload);
      return { user: existingUser, token };
    } else {

      if (existingUser) {
        const jwtPayload = { email: existingUser.email, sub: existingUser.id, role: existingUser.role };
        const token = this.jwtService.sign(jwtPayload);
        return { user: existingUser, token };
      }


      const newUser = this.userRepository.create({
        email,
        firstName,
        lastName,
        role,
        password: Math.random().toString(36).slice(-16),
      });
      const savedUser = await this.userRepository.save(newUser);

      if (role === UserRole.CANDIDATE) {
        const candidateProfile = this.candidateProfileRepository.create({ user: savedUser });
        await this.candidateProfileRepository.save(candidateProfile);
      } else if (role === UserRole.RECRUITER) {
        const recruiterProfile = this.recruiterProfileRepository.create({ user: savedUser, companyName: 'N/A' });
        await this.recruiterProfileRepository.save(recruiterProfile);
      }

      const jwtPayload = { email: savedUser.email, sub: savedUser.id, role: savedUser.role };
      const token = this.jwtService.sign(jwtPayload);
      return { user: savedUser, token };
    }
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, firstName, lastName, companyName } = registerDto;

    const emailDomain = email.split('@')[1].toLowerCase();
    if (this.blockedEmailDomains.includes(emailDomain)) {
      throw new BadRequestException('Email domain is not allowed');
    }

    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    if (!password || password.trim().length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const role = companyName ? UserRole.RECRUITER : UserRole.CANDIDATE;

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      companyName,
      role,
    });

    const savedUser = await this.userRepository.save(user);

    if (role === UserRole.CANDIDATE) {
      const candidateProfile = this.candidateProfileRepository.create({ user: savedUser, isVisible: true });
      await this.candidateProfileRepository.save(candidateProfile);
    } else if (role === UserRole.RECRUITER) {
      const recruiterProfile = this.recruiterProfileRepository.create({
        user: savedUser,
        companyName: savedUser.companyName,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
      });
      await this.recruiterProfileRepository.save(recruiterProfile);
    }

    return savedUser;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();

    if (!user) throw new NotFoundException('User not found');

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await this.userRepository.save(user);

    // Use the centralized EmailService with professional HTML template
    try {
      await this.emailService.sendPasswordResetOTP(email, token);
      console.log(`✅ Password reset OTP sent to ${email}`);
    } catch (error) {
      console.error('❌ Failed to send password reset OTP:', error.message);
      throw new BadRequestException('Failed to send OTP. Please try again.');
    }

    return { message: 'OTP sent to your email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, password } = resetPasswordDto;
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });
    if (!user) throw new BadRequestException('Invalid or expired token');
    user.password = await bcrypt.hash(password.trim(), 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);
    return { message: 'Password reset successfully' };
  }

  async logout(token: string): Promise<void> {
    return;
  }

  async deleteAccount(userId: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['candidateProfile', 'recruiterProfile', 'jobs', 'applications', 'sentMessages', 'receivedMessages'],
    });

    if (!user) throw new NotFoundException('User not found');

    // 1. Clean up Chat System (Conversations & Messages)
    // Find conversations where user is a participant
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participant')
      .where('participant.id = :userId', { userId })
      .getMany();

    for (const conversation of conversations) {
      // Remove user from participants
      conversation.participants = conversation.participants.filter(p => p.id !== userId);

      if (conversation.participants.length === 0) {
        // If no participants left, delete conversation and its messages
        await this.chatMessageRepository.delete({ conversation: { id: conversation.id } });
        await this.conversationRepository.remove(conversation);
      } else {
        // Save updated participants
        await this.conversationRepository.save(conversation);
      }
    }

    // Delete any remaining chat messages sent by this user
    await this.chatMessageRepository.delete({ sender: { id: userId } });

    // 2. Clean up Scraped Jobs & Posts
    await this.scrapedJobRepository.delete({ user: { id: userId } });
    await this.postRepository.delete({ author: { id: userId } });

    // 3. Clean up Recruiter/Candidate specific data
    // Delete screening results where user is the candidate
    await this.screeningResultRepository.delete({ candidate: { id: userId } });

    // If user is recruiter, we need to delete screening results for their jobs before deleting jobs
    // (This is implicitly handled if we delete jobs, but explicit is safer)
    if (user.jobs && user.jobs.length > 0) {
      // Find all job IDs for this recruiter
      const jobIds = user.jobs.map(job => job.id);
      if (jobIds.length > 0) {
        await this.screeningResultRepository.delete({ job: { id: In(jobIds) } });
      }
    }

    if (user.applications) await this.applicationRepository.delete({ candidate: { id: userId } });
    if (user.jobs) await this.jobRepository.delete({ recruiter: { id: userId } });

    // 4. Clean up Recruiter Messages (different from Chat Messages)
    if (user.sentMessages) await this.messageRepository.delete({ sender: { id: userId } });
    if (user.receivedMessages) await this.messageRepository.delete({ receiver: { id: userId } });

    // 5. Clean up Profiles
    if (user.candidateProfile) await this.candidateProfileRepository.delete({ id: user.candidateProfile.id });
    if (user.recruiterProfile) await this.recruiterProfileRepository.delete({ id: user.recruiterProfile.id });

    // 6. Finally delete the user
    await this.userRepository.delete(userId);

    return { message: 'Account deleted successfully' };
  }

  async validateUserFromPayload(payload: { sub: number; email: string }): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: payload.sub } });
  }
}
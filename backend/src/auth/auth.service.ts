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
import { CandidateProfile } from '../candidate/entities/candidate-profile.entity';
import { RecruiterProfile } from '../recruiter/entities/recruiter-profile.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { UpdateUserDto } from './dto/update-user.dto';

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
    @InjectRepository(CandidateProfile)
    private candidateProfileRepository: Repository<CandidateProfile>, 
    @InjectRepository(RecruiterProfile)
    private recruiterProfileRepository: Repository<RecruiterProfile>,
    private jwtService: JwtService,
  ) {}

  

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
    // --- THIS IS THE FIX (Part 2) ---
    // We add 'applications' and 'applications.job' to the relations.
    // This will attach the user's application history to the user object.
    let user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'candidateProfile', 
        'recruiterProfile', 
        'candidateProfile.savedJobs', // Keep existing relations
        'applications',               // Add this
        'applications.job'            // And this, to get the job ID in the application object
      ], 
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    if (user.role === UserRole.CANDIDATE && !user.candidateProfile) {
      // If profile doesn't exist, create it (this logic is good)
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
      // If the intent is to log in, the user MUST exist.
      if (!existingUser) {
        throw new BadRequestException('Account not found. Please register first.');
      }
      // If they exist, log them in.
      const jwtPayload = { email: existingUser.email, sub: existingUser.id, role: existingUser.role };
      const token = this.jwtService.sign(jwtPayload);
      return { user: existingUser, token };
    } else { // action === 'register'
      // If the intent is to register but the user already exists, just log them in.
      // This prevents errors and provides a smooth user experience.
      if (existingUser) {
        const jwtPayload = { email: existingUser.email, sub: existingUser.id, role: existingUser.role };
        const token = this.jwtService.sign(jwtPayload);
        return { user: existingUser, token };
      }

      // If they don't exist, create a new account.
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
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });
    try {
      await transporter.sendMail({
        to: email,
        subject: 'NexHire Password Reset OTP',
        text: `Your OTP for password reset is: ${token}. It expires in 5 minutes.`,
      });
    } catch (error) {
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
    if (user.applications) await this.applicationRepository.delete({ candidate: { id: userId } });
    if (user.jobs) await this.jobRepository.delete({ recruiter: { id: userId } });
    if (user.sentMessages) await this.messageRepository.delete({ sender: { id: userId } });
    if (user.receivedMessages) await this.messageRepository.delete({ receiver: { id: userId } });

    if(user.candidateProfile) await this.candidateProfileRepository.delete({ id: user.candidateProfile.id });
    if(user.recruiterProfile) await this.recruiterProfileRepository.delete({ id: user.recruiterProfile.id });
    
    await this.userRepository.delete(userId);
    return { message: 'Account deleted successfully' };
  }

  async validateUserFromPayload(payload: { sub: number; email: string }): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: payload.sub } });
  }
}
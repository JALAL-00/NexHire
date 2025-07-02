import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Job } from '../jobs/entities/job.entity';
import { User, UserRole } from '../auth/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SearchCandidateDto } from './dto/search-candidate.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { Message } from './entities/message.entity';
import { EmailService } from '../common/email.service';
import { ApplicationsService } from '../applications/applications.service';
import { ScreeningResult } from '../screening/entities/screening-result.entity';
import { CandidateProfile } from '../candidate/entities/candidate-profile.entity';
import { RecruiterProfile } from './entities/recruiter-profile.entity';
import { Application, ApplicationStatus } from '../applications/entities/application.entity';
import { Interview } from 'src/interviews/entities/interview.entity';


@Injectable()
export class RecruiterService {
  jobRepo: any;
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(CandidateProfile)
    private candidateProfileRepository: Repository<CandidateProfile>,
    @InjectRepository(ScreeningResult)
    private screeningResultRepository: Repository<ScreeningResult>,
    @InjectRepository(RecruiterProfile)
    private recruiterProfileRepository: Repository<RecruiterProfile>,
    private emailService: EmailService,
    private applicationsService: ApplicationsService,
    @InjectRepository(Application) private readonly appRepo: Repository<Application>,
    @InjectRepository(Interview) private readonly interviewRepo: Repository<Interview>,
  ) {}

  async checkJobPostingStatus(userId: number): Promise<{ canPost: boolean }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['postedJobs'], // We need the count of existing jobs
    });

    if (!user) {
      // This case is unlikely for a logged-in user but good for safety
      throw new NotFoundException('User not found.');
    }

    // A premium user can always post
    if (user.isPremium) {
      return { canPost: true };
    }

    // A non-premium user can only post if they have 0 jobs
    return { canPost: user.postedJobs.length < 1 };
  }

  async getJobsCount(recruiterId: number): Promise<number> {
    return this.jobRepository.count({ where: { recruiter: { id: recruiterId } } });
  }

  async getProfile(userId: number): Promise<RecruiterProfile> {
    const profile = await this.recruiterProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<RecruiterProfile> {
    let profile = await this.recruiterProfileRepository.findOne({ where: { user: { id: userId } } });
    if (!profile) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      profile = this.recruiterProfileRepository.create({ user, ...updateProfileDto });
    } else {
      Object.assign(profile, updateProfileDto);
    }
    return this.recruiterProfileRepository.save(profile);
  }

  // --- THIS IS THE FIX (Part 1) ---
  // The paginated list now also formats the job status, ensuring consistency.
  async listJobsPaginated(userId: number, page = 1, limit = 10): Promise<{ jobs: Job[]; totalCount: number; totalPages: number }> {
    const [jobs, totalCount] = await this.jobRepository.findAndCount({
      where: { recruiter: { id: userId } },
      relations: ['applications'],
      order: { id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedJobs = jobs.map(job => ({
      ...job,
      status: job.status || 'Active', // Default null status to 'Active'
      applicationCount: job.applications?.length || 0,
    }));

    return {
      jobs: formattedJobs as Job[], // Cast to Job[] to satisfy the return type
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async createJob(userId: number, createJobDto: CreateJobDto): Promise<Job> {
    const recruiter = await this.userRepository.findOne({ where: { id: userId } });
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }
    const job = this.jobRepository.create({ ...createJobDto, recruiter });
    return this.jobRepository.save(job);
  }

  async updateJob(userId: number, jobId: number, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
    if (!job) {
      throw new NotFoundException('Job not found or not authorized');
    }
    const { jobId: _, ...updateData } = updateJobDto;
    Object.assign(job, updateData);
    return this.jobRepository.save(job);
  }

  async deleteJob(userId: number, jobId: number): Promise<{ message: string }> {
    const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
    if (!job) {
      throw new NotFoundException('Job not found or not authorized');
    }
    await this.screeningResultRepository.delete({ job: { id: jobId } });
    await this.jobRepository.remove(job);
    return { message: 'Job deleted successfully' };
  }

  // --- THIS IS THE FIX (Part 2) ---
  // The simple job list (for the profile) now formats the status as well.
  async listJobs(userId: number): Promise<Job[]> {
    const jobs = await this.jobRepository.find({
      where: { recruiter: { id: userId } },
      relations: ['applications'],
      order: { id: 'DESC' },
    });

    // Add the same formatting logic here to ensure 'status' is never null.
    return jobs.map(job => ({
      ...job,
      status: job.status || 'Active',
    } as Job));
  }

  async viewApplications(userId: number, jobId: number): Promise<Application[]> {
    const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
    if (!job) {
      throw new NotFoundException('Job not found or you are not authorized to view its applications.');
    }
    return this.applicationsService.findByJob(jobId);
  }
  
  async searchCandidates(searchCandidateDto: SearchCandidateDto): Promise<CandidateProfile[]> {
    const { title, skills, location } = searchCandidateDto;
    return this.candidateProfileRepository.find({
      where: {
        ...(title && { firstName: Like(`%${title}%`) }),
        ...(skills && { skills: Like(`%${skills}%`) }),
        ...(location && { phone: Like(`%${location}%`) }),
      },
      relations: ['user'],
    });
  }
  
  async sendMessage(userId: number, sendMessageDto: SendMessageDto): Promise<Message> {
    const { receiverId, content } = sendMessageDto;
    const sender = await this.userRepository.findOne({ where: { id: userId } });
    const receiver = await this.userRepository.findOne({ where: { id: receiverId, role: UserRole.CANDIDATE } });
    if (!sender || !receiver) {
      throw new NotFoundException('Sender or receiver not found');
    }
    const message = this.messageRepository.create({ content, sender, receiver });
    await this.sendEmailNotification(receiver.email, 'New Message', `You received a message: ${content}`);
    return this.messageRepository.save(message);
  }

  private async sendEmailNotification(email: string, subject: string, message: string): Promise<void> {
    console.log(`Sending email notification to: ${email}`);
    await this.emailService.sendMail(email, subject, message);
    console.log(`Email notification sent to ${email}`);
  }

  private async notifyCandidates(job: Job): Promise<void> {
    const candidates = await this.userRepository.find({ where: { role: UserRole.CANDIDATE } });
    for (const candidate of candidates) {
      await this.sendEmailNotification(
        candidate.email,
        `New Job Opportunity: ${job.title}`,
        `A new job "${job.title}" has been posted. Location: ${job.location}, Salary: ${job.salary}.`,
      );
    }
  }

async getDashboardStats(recruiterId: number) {
    // We run all count queries in parallel for efficiency
    const [totalJobs, totalApplicants, totalShortlisted, totalInterviews] = await Promise.all([
      // 1. Total Jobs: Use the correct repository name 'jobRepository'
      this.jobRepository.count({
        where: { recruiter: { id: recruiterId } },
      }),
      // 2. Total applications: 'appRepo' is correct
      this.appRepo.count({
        where: { job: { recruiter: { id: recruiterId } } },
      }),
      // 3. Total "accepted" applications: 'appRepo' is correct
      this.appRepo.count({
        where: {
          status: ApplicationStatus.ACCEPTED,
          job: { recruiter: { id: recruiterId } },
        },
      }),
      // 4. Total interviews: 'interviewRepo' is correct
      this.interviewRepo.count({
        where: { application: { job: { recruiter: { id: recruiterId } } } },
      }),
    ]);

    return {
      totalJobs,
      totalApplicants,
      totalShortlisted,
      totalInterviews,
    };
  }
}
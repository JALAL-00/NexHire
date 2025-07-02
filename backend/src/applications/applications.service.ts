// src/applications/applications.service.ts
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './entities/application.entity';
import { User } from '../auth/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { EmailService } from '../common/email.service';

@Injectable()
export class ApplicationsService {
  findByRecruiter(id: any) {
    throw new Error('Method not implemented.');
  }
  findByJob(jobId: number): Application[] | PromiseLike<Application[]> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private emailService: EmailService,
  ) {}

  async create(userId: number, createApplicationDto: CreateApplicationDto): Promise<Application> {
    
    const { jobId, coverLetter, resume } = createApplicationDto;

    const candidate = await this.userRepository.findOne({ where: { id: userId } });
    const job = await this.jobRepository.findOne({ where: { id: jobId }, relations: ['recruiter'] });
    
    if (!candidate || !job) {
      throw new NotFoundException('Candidate or job not found');
    }

    // --- THIS IS THE FIX (Part 1) ---
    // Check if an application already exists for this user and job.
    const existingApplication = await this.applicationRepository.findOne({
      where: { candidate: { id: userId }, job: { id: jobId } },
    });

    if (existingApplication) {
      throw new ConflictException('You have already applied for this job.');
    }

    // Create the application with the specific resume path from the DTO
    const application = this.applicationRepository.create({
      job: job,
      candidate: candidate,
      resume: resume, 
      coverLetter: coverLetter,
      status: ApplicationStatus.PENDING,
    });

    const savedApplication = await this.applicationRepository.save(application);
    await this.notifyRecruiter(job.recruiter.email, job.title, candidate.email);

    return savedApplication;
  }
  

  async findByCandidate(userId: number): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { candidate: { id: userId } },
      relations: ['job', 'job.recruiter'],
    });
  }


  async findByJobForRecruiter(recruiterId: number, jobId: number): Promise<Application[]> {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['recruiter'],
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found.`);
    }

    if (job.recruiter.id !== recruiterId) {
      throw new UnauthorizedException('You are not authorized to view applications for this job.');
    }

    return this.applicationRepository.find({
      where: { job: { id: jobId } },
      relations: ['candidate', 'candidate.candidateProfile', 'job'],
    });
  }

  async getAllApplications(recruiterId: number): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { job: { recruiter: { id: recruiterId } } },
      relations: ['job', 'candidate'],
    });
  }

  async updateStatus(applicationId: number, status: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['candidate', 'job'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    application.status = status as ApplicationStatus;
    const updatedApplication = await this.applicationRepository.save(application);

    await this.emailService.sendMail(
      application.candidate.email,
      `Application Status Update for ${application.job.title}`,
      `Your application for "${application.job.title}" has been updated to "${status}".`,
    );

    return updatedApplication;
  }

  private async notifyRecruiter(recruiterEmail: string, jobTitle: string, candidateEmail: string): Promise<void> {
    await this.emailService.sendMail(
      recruiterEmail,
      `New Application for ${jobTitle}`,
      `A candidate (${candidateEmail}) has applied for your job "${jobTitle}".`,
    );
  }

  /**
   * Finds the most recent applications for a given recruiter.
   * @param recruiterId The ID of the recruiter.
   * @param limit The maximum number of applications to return.
   * @returns A list of the most recent applications.
   */
  async findRecentApplicants(recruiterId: number, limit: number = 4): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { job: { recruiter: { id: recruiterId } } },
      relations: [
        'candidate',
        'candidate.candidateProfile', 
      ],
      order: {
        createdAt: 'DESC', 
      },
      take: limit, // Limit the number of results
    });
  }

  /**
   * Finds all applications with 'accepted' status for a given recruiter.
   * @param recruiterId The ID of the recruiter.
   * @returns A list of shortlisted applications.
   */
  async findShortlistedByRecruiter(recruiterId: number): Promise<Application[]> {
    return this.applicationRepository.find({
      where: {
        status: ApplicationStatus.ACCEPTED,
        job: { recruiter: { id: recruiterId } },
      },
      relations: [
        'job', 
        'candidate',
        'candidate.candidateProfile',
      ],
      order: {
        createdAt: 'DESC', 
      },
    });
  }
}
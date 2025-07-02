// src/candidate/candidate.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { User } from '../auth/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { JobsService } from '../jobs/jobs.service';
import * as fs from 'fs/promises';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(CandidateProfile)
    private profileRepository: Repository<CandidateProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job) // <-- ADD THIS
    private jobRepository: Repository<Job>,
    private jobsService: JobsService,
  ) {}

  async getProfile(userId: number): Promise<CandidateProfile> {
    const profile = await this.profileRepository.findOne({ where: { user: { id: userId } }, relations: ['user', 'savedJobs'] });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<CandidateProfile> {
    let profile = await this.profileRepository.findOne({ where: { user: { id: userId } } });
    if (!profile) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      profile = this.profileRepository.create({ user, ...updateProfileDto });
    } else {
      Object.assign(profile, updateProfileDto);
    }
    return this.profileRepository.save(profile);
  }

  async uploadResume(userId: number, file: Express.Multer.File): Promise<{ filePath: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const filePath = file.path;
    user.resume = filePath; 
    await this.userRepository.save(user);

    return { filePath };
  }

  async deleteResume(userId: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.resume) {
      throw new BadRequestException('No resume to delete');
    }
    try {
      await fs.unlink(user.resume);
    } catch (error) {
      console.error(`Failed to delete resume file at ${user.resume}: ${error.message}`);
    }
    user.resume = ''; 
    await this.userRepository.save(user);
    return { message: 'Resume deleted successfully' };
  }

  async searchJobs(searchJobsDto: SearchJobsDto): Promise<Job[]> {
    const result = await this.jobsService.findAll(searchJobsDto);
    return result.jobs;
  }

  async getSavedJobs(userId: number): Promise<Job[]> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['savedJobs', 'savedJobs.recruiter'], // Eagerly load recruiter info for the list page
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile.savedJobs;
  }

  async saveJob(userId: number, jobId: number): Promise<CandidateProfile> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['savedJobs'],
    });
    if (!profile) throw new NotFoundException('Profile not found');

    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');

    const isAlreadySaved = profile.savedJobs.some((savedJob) => savedJob.id === jobId);
    if (!isAlreadySaved) {
      profile.savedJobs.push(job);
      await this.profileRepository.save(profile);
    }
    return profile;
  }

  async unsaveJob(userId: number, jobId: number): Promise<CandidateProfile> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['savedJobs'],
    });
    if (!profile) throw new NotFoundException('Profile not found');

    profile.savedJobs = profile.savedJobs.filter((savedJob) => savedJob.id !== jobId);
    return this.profileRepository.save(profile);
  }

}
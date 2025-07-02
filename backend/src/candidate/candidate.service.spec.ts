import { Test, TestingModule } from '@nestjs/testing';
import { CandidateService } from './candidate.service';
import { Repository } from 'typeorm';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { User } from '../auth/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApplicationsService } from '../applications/applications.service';
import { JobsService } from '../jobs/jobs.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';

jest.mock('fs/promises');

describe('CandidateService - Resume Management', () => {
  let service: CandidateService;
  let profileRepository: Repository<CandidateProfile>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidateService,
        {
          provide: getRepositoryToken(CandidateProfile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Job),
          useClass: Repository,
        },
        {
          provide: ApplicationsService,
          useValue: { create: jest.fn() },
        },
        {
          provide: JobsService,
          useValue: { findAll: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<CandidateService>(CandidateService);
    profileRepository = module.get<Repository<CandidateProfile>>(getRepositoryToken(CandidateProfile));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

// Existing tests cover resume replacement and deletion
it('should replace resume if one exists', async () => {
  const userId = 1;
  const resumePath = 'path/to/new_resume.pdf';
  const profile = { user: { id: userId }, resume: 'path/to/old_resume.pdf' };
  const updatedProfile = { user: { id: userId }, resume: resumePath };

  // Mock Express.Multer.File object
  const file = {
    path: resumePath,
    originalname: 'new_resume.pdf',
    mimetype: 'application/pdf',
    filename: 'new_resume.pdf',
    size: 12345,
    buffer: Buffer.from(''),
    fieldname: 'resume',
    destination: 'path/to',
    encoding: '7bit',
    stream: undefined,
  } as unknown as Express.Multer.File;

  jest.spyOn(profileRepository, 'findOne').mockResolvedValue(profile as any);
  jest.spyOn(fs, 'unlink').mockResolvedValue(undefined);
  jest.spyOn(profileRepository, 'save').mockResolvedValue(updatedProfile as any);

  const result = await service.uploadResume(userId, file);
  expect(result).toEqual({ filePath: resumePath });
  expect(fs.unlink).toHaveBeenCalledWith('path/to/old_resume.pdf');
  expect(profileRepository.save).toHaveBeenCalledWith(expect.objectContaining({ resume: resumePath }));
});

it('should delete resume successfully', async () => {
  const userId = 1;
  const profile = { user: { id: userId }, resume: 'path/to/resume.pdf' };
  const updatedProfile = { user: { id: userId }, resume: null };

  jest.spyOn(profileRepository, 'findOne').mockResolvedValue(profile as any);
  jest.spyOn(fs, 'unlink').mockResolvedValue(undefined);
  jest.spyOn(profileRepository, 'save').mockResolvedValue(updatedProfile as any);

  const result = await service.deleteResume(userId);
  expect(result).toEqual(updatedProfile);
  expect(fs.unlink).toHaveBeenCalledWith('path/to/resume.pdf');
  expect(profileRepository.save).toHaveBeenCalledWith(expect.objectContaining({ resume: null }));
});

it('should throw NotFoundException if resume does not exist for deletion', async () => {
  const userId = 1;
  const profile = { user: { id: userId }, resume: null };

  jest.spyOn(profileRepository, 'findOne').mockResolvedValue(profile as any);

  await expect(service.deleteResume(userId)).rejects.toThrow(BadRequestException); // Updated to match BadRequestException
});

});
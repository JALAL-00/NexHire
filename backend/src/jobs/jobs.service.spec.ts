import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

describe('JobsService - Caching', () => {
  let service: JobsService;
  let jobRepository: Repository<Job>;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: getRepositoryToken(Job),
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    jobRepository = module.get<Repository<Job>>(getRepositoryToken(Job));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should return cached jobs if available', async () => {
    const listJobsDto = { location: 'New York', skills: ['JavaScript'], salary: '$100,000' };
    const cachedJobs = [{ id: 1, title: 'Software Engineer' }];

    jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedJobs);
    jest.spyOn(jobRepository, 'find').mockResolvedValue([]);

    const result = await service.findAll(listJobsDto);
    expect(result).toEqual(cachedJobs);
    expect(cacheManager.get).toHaveBeenCalledWith(`jobs_${JSON.stringify(listJobsDto)}`);
    expect(jobRepository.find).not.toHaveBeenCalled();
  });

  it('should fetch and cache jobs if not in cache', async () => {
    const listJobsDto = { location: 'New York', skills: ['JavaScript'], salary: '$100,000' };
    const jobs = [{ id: 1, title: 'Software Engineer' }];

    jest.spyOn(cacheManager, 'get').mockResolvedValue(null); // Simulate no cache
    jest.spyOn(jobRepository, 'find').mockResolvedValue(jobs as any);
    jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

    const result = await service.findAll(listJobsDto);
    expect(result).toEqual(jobs);
    expect(cacheManager.get).toHaveBeenCalledWith(`jobs_${JSON.stringify(listJobsDto)}`);
    expect(jobRepository.find).toHaveBeenCalled();
    expect(cacheManager.set).toHaveBeenCalledWith(`jobs_${JSON.stringify(listJobsDto)}`, jobs, { ttl: 300 });
  });

  it('should handle an empty database result and return an empty array', async () => {
    const listJobsDto = { location: 'Los Angeles', skills: ['Python'], salary: '$80,000' };
    jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
    jest.spyOn(jobRepository, 'find').mockResolvedValue([]);  // Simulate empty database response
    jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

    const result = await service.findAll(listJobsDto);
    expect(result).toEqual([]);
    expect(cacheManager.get).toHaveBeenCalledWith(`jobs_${JSON.stringify(listJobsDto)}`);
    expect(jobRepository.find).toHaveBeenCalled();
  });

  it('should handle cache miss and database failure gracefully', async () => {
    const listJobsDto = { location: 'Miami', skills: ['Ruby'], salary: '$95,000' };
    jest.spyOn(cacheManager, 'get').mockResolvedValue(null); // Simulate no cache
    jest.spyOn(jobRepository, 'find').mockRejectedValue(new Error('Database error'));  // Simulate a DB failure

    try {
      await service.findAll(listJobsDto);
    } catch (err) {
      expect(err.message).toBe('Database error');
    }
    expect(cacheManager.get).toHaveBeenCalledWith(`jobs_${JSON.stringify(listJobsDto)}`);
    expect(jobRepository.find).toHaveBeenCalled();
  });
});

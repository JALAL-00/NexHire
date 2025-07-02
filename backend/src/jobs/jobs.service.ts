import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm'; // Import ILike for case-insensitive search
import { Job } from './entities/job.entity';
import { ListJobsDto } from './dto/list-jobs.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

    async findLatest(limit: number = 2): Promise<Job[]> {
    try {
      return await this.jobRepository.find({
        order: { createdAt: 'DESC' }, // Get the newest jobs first
        take: limit, // Limit the number of results
        relations: ['recruiter'], // Include basic recruiter info like company name
      });
    } catch (error) {
      console.error("Error fetching latest jobs:", error);
      throw new InternalServerErrorException('Error fetching job recommendations');
    }
  }
  

  async findAll(listJobsDto: ListJobsDto): Promise<{ jobs: Job[]; totalCount: number; totalPages: number; currentPage: number }> {
    try {
      // Set default values for pagination if not provided
      const { 
        location, 
        skills, 
        salary, 
        jobTitle, 
        jobType, 
        page = 1, 
        limit = 10 
      } = listJobsDto;

      // --- SWITCHING TO QUERY BUILDER FOR MORE POWERFUL FILTERING ---
      const queryBuilder = this.jobRepository.createQueryBuilder('job');

      // Add relations to include recruiter data
      queryBuilder.leftJoinAndSelect('job.recruiter', 'recruiter');

      // Add filters based on provided parameters
      if (jobTitle) {
        // Use ILike for case-insensitive matching (PostgreSQL specific)
        queryBuilder.andWhere('job.title ILIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
      }

      if (location) {
        queryBuilder.andWhere('job.location ILIKE :location', { location: `%${location}%` });
      }

      if (salary) {
        // This assumes salary is a string range like "50k-70k". Adjust if needed.
        queryBuilder.andWhere('job.salary LIKE :salary', { salary: `%${salary}%` });
      }

      if (jobType && jobType.length > 0) {
        const types = Array.isArray(jobType) ? jobType : [jobType];
        queryBuilder.andWhere('job.jobType IN (:...types)', { types });
      }
      
      if (skills && skills.length > 0) {
        skills.forEach((skill, index) => {
          queryBuilder.andWhere(`job.skills LIKE :skill${index}`, {
            [`skill${index}`]: `%${skill}%`,
          });
        });
      }

      // Apply pagination
      queryBuilder.skip((page - 1) * limit).take(limit);

      // Execute the query
      const [jobs, totalCount] = await queryBuilder.getManyAndCount();

      return {
        jobs,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };

    } catch (error) {
      console.error("Error fetching job listings:", error);
      throw new InternalServerErrorException('Error fetching job listings');
    }
  }

  async findOne(id: number): Promise<Job> {
    try {
      const job = await this.jobRepository.findOne({ 
        where: { id }, 
        relations: ['recruiter'] 
      });
      if (!job) {
        throw new NotFoundException(`Job with ID ${id} not found`);
      }
      return job;
    } catch (error) {
      console.error("Error fetching job:", error);
      throw new InternalServerErrorException('Error fetching job');
    }
  }

  async countJobsByRecruiter(recruiterId: number): Promise<number> {
    try {
      const count = await this.jobRepository.count({
        where: { recruiter: { id: recruiterId } },
      });
      return count;
    } catch (error) {
      console.error(`Error counting jobs for recruiter ${recruiterId}:`, error);
      throw new InternalServerErrorException('Could not retrieve job count.');
    }
  }
  
}
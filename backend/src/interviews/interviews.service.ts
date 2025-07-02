import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from './entities/interview.entity';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { Application } from 'src/applications/entities/application.entity';

@Injectable()
export class InterviewsService {
  // The [x: string]: any; line is not needed and can be removed.
  constructor(
    @InjectRepository(Interview) private interviewRepo: Repository<Interview>,
    @InjectRepository(Application) private appRepo: Repository<Application>,
  ) {}

  async create(dto: CreateInterviewDto): Promise<Interview> {
    const application = await this.appRepo.findOneBy({ id: dto.applicationId });
    if (!application) {
      throw new NotFoundException(`Application with ID ${dto.applicationId} not found.`);
    }

    const newInterview = this.interviewRepo.create({
      ...dto,
      application,
    });
    return this.interviewRepo.save(newInterview);
  }

  async findAllForRecruiter(recruiterId: number): Promise<Interview[]> {
    return this.interviewRepo.find({
      where: { application: { job: { recruiter: { id: recruiterId } } } },
      relations: ['application', 'application.candidate', 'application.job'], 
      order: { date: 'ASC' },
    });
  }
  
  // --- THIS IS THE FIX ---
  // Change `this.interviewRepository` to `this.interviewRepo`
  async remove(id: number): Promise<void> {
    const result = await this.interviewRepo.delete(id); // Use the correct variable name
    if (result.affected === 0) {
      throw new NotFoundException(`Interview with ID ${id} not found`);
    }
  }
}
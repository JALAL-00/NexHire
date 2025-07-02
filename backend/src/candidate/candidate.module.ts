import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { User } from '../auth/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { JobsService } from '../jobs/jobs.service';
import { EmailService } from '../common/email.service';
import { ApplicationsModule } from '../applications/applications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateProfile, User, Job]),
    ApplicationsModule,
  ],
  controllers: [CandidateController],
  providers: [CandidateService, JobsService, EmailService],
})
export class CandidateModule {}
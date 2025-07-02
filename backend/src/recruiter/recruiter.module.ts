import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruiterController } from './recruiter.controller';
import { RecruiterService } from './recruiter.service';
import { Job } from '../jobs/entities/job.entity';
import { User } from '../auth/entities/user.entity';
import { Message } from './entities/message.entity';
import { EmailService } from '../common/email.service';
import { ScreeningResult } from '../screening/entities/screening-result.entity';
import { CandidateProfile } from '../candidate/entities/candidate-profile.entity';
import { RecruiterProfile } from './entities/recruiter-profile.entity';
import { ApplicationsModule } from '../applications/applications.module'; 
import { AuthModule } from '../auth/auth.module';
import { Application } from 'src/applications/entities/application.entity';
import { Interview } from 'src/interviews/entities/interview.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Job,
      User,
      Message,
      Application,
      Interview,
      ScreeningResult,
      CandidateProfile,
      RecruiterProfile,
    ]),
    AuthModule,
    ApplicationsModule, // <-- IMPORT IT HERE
  ],
  controllers: [RecruiterController],
  // Remove ApplicationsService from providers, as it's provided by the imported module
  providers: [RecruiterService, EmailService], 
})
export class RecruiterModule {}
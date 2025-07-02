import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScreeningService } from './screening.service';
import { ScreeningController } from './screening.controller';
import { ScreeningResult } from './entities/screening-result.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { User } from '../auth/entities/user.entity';
import { EmailService } from '../common/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScreeningResult, Job, Application, User])],
  providers: [ScreeningService, EmailService],
  controllers: [ScreeningController],
})
export class ScreeningModule {}
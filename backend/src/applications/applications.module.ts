import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application } from './entities/application.entity';
import { Job } from '../jobs/entities/job.entity';
import { User } from '../auth/entities/user.entity';
import { EmailService } from '../common/email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Job, User]),
    ConfigModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, EmailService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
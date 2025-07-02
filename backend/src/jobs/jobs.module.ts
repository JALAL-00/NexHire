import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './entities/job.entity';
import { User } from '../auth/entities/user.entity';
import { EmailService } from '../common/email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, User]),
    ConfigModule,
  ],
  controllers: [JobsController],
  providers: [JobsService, EmailService],
  exports: [JobsService],
})
export class JobsModule {}
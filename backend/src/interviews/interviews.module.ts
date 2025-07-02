import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewsService } from './interviews.service';
import { InterviewsController } from './interviews.controller';
import { Interview } from './entities/interview.entity';
import { Application } from 'src/applications/entities/application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interview, Application]), 
  ],
  controllers: [InterviewsController],
  providers: [InterviewsService],
})
export class InterviewsModule {}
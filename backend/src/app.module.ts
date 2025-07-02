import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RecruiterModule } from './recruiter/recruiter.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { CandidateModule } from './candidate/candidate.module';
import { ScraperModule } from './scraper/scraper.module';
import { ScreeningModule } from './screening/screening.module';
import { EmailService } from './common/email.service';
import { CommonModule } from './common/common.module';
import { NexiAiModule } from './nexi-ai/nexi-ai.module';
import { ChatModule } from './chat/chat.module';
import { PaymentsModule } from './payments/payments.module';
import { PostsModule } from './posts/posts.module';
import { ServeStaticModule } from '@nestjs/serve-static'; 
import { join } from 'path'; 
import { UsersModule } from './users/users.module'; 
import { InterviewsModule } from './interviews/interviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
      ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true, 
    }),
    AuthModule,
    JobsModule,
    RecruiterModule,
    CandidateModule,
    ApplicationsModule,
    ScraperModule,
    ScreeningModule,
    CommonModule,
    NexiAiModule,
    ChatModule,
    PaymentsModule,
    PostsModule,
    UsersModule,
    InterviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            autoLoadEntities: true,
            synchronize: true, // Note: Set to false in production usually, but keeping true for your dev/demo
            ssl: {
              rejectUnauthorized: false, // Required for Railway/Heroku secure connections
            },
          };
        }
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT') || 5432,
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
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
export class AppModule { }
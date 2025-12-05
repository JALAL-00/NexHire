import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { RecruiterMessage } from '../recruiter/entities/message.entity';
import { Message as ChatMessage } from '../chat/entities/message.entity';
import { Conversation } from '../chat/entities/conversation.entity';
import { ScrapedJob } from '../scraper/entities/scraped-job.entity';
import { Post } from '../posts/entities/post.entity';
import { ScreeningResult } from '../screening/entities/screening-result.entity';
import { Interview } from '../interviews/entities/interview.entity';
import { CandidateProfile } from '../candidate/entities/candidate-profile.entity';
import { RecruiterProfile } from '../recruiter/entities/recruiter-profile.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { RoleGuard } from './guards/role.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { EmailService } from '../common/email.service';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Job,
      Application,
      RecruiterMessage,
      ChatMessage,
      Conversation,
      ScrapedJob,
      Post,
      ScreeningResult,
      Interview,
      CandidateProfile,
      RecruiterProfile
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, RoleGuard, JwtAuthGuard, EmailService],
  exports: [AuthService, JwtStrategy, PassportModule, JwtAuthGuard, JwtModule],
})
export class AuthModule { }
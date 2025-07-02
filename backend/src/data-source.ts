import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './auth/entities/user.entity';
import { Message } from './recruiter/entities/message.entity';
import { Job } from './jobs/entities/job.entity';
import { CandidateProfile } from './candidate/entities/candidate-profile.entity';
import { ScreeningResult } from './screening/entities/screening-result.entity';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST') || 'localhost',
  port: configService.get('DB_PORT') || 5432,
  username: configService.get('DB_USERNAME') || 'postgres',
  password: configService.get('DB_PASSWORD') || '46356',
  database: configService.get('DB_NAME') || 'job_db',
  entities: [User, Message, Job, CandidateProfile, ScreeningResult],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
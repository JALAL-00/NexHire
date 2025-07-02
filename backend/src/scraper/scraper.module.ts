import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapedJob } from './entities/scraped-job.entity';
import { User } from '../auth/entities/user.entity';
import { LinkedinStrategy } from './strategies/linkedin.strategy';
import { IndeedStrategy } from './strategies/indeed.strategy';
import { BdjobsStrategy } from './strategies/bdjobs.strategy';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ScrapedJob, User])],
  controllers: [ScraperController],
  providers: [ScraperService, LinkedinStrategy, IndeedStrategy, BdjobsStrategy],
})
export class ScraperModule {}
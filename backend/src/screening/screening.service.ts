import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScreeningResult } from './entities/screening-result.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { User } from '../auth/entities/user.entity';
import { EmailService } from '../common/email.service';
import { ResumeParser } from '../common/resume-parser.util';

@Injectable()
export class ScreeningService {
  constructor(
    @InjectRepository(ScreeningResult)
    private screeningResultRepository: Repository<ScreeningResult>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  // Utility: Extract and tokenize specific job fields with weights
  private buildJobProfileText(job: Job): {
    skillsText: string;
    experienceText: string;
    descriptionText: string;
    educationText: string;
    otherText: string;
  } {
    return {
      skillsText: (job.skills?.join(' ') || '').toLowerCase(),
      experienceText: (job.experience || '').toLowerCase(),
      descriptionText: [job.description, job.responsibilities].filter(Boolean).join(' ').toLowerCase(),
      educationText: (job.education || '').toLowerCase(),
      otherText: [job.title, job.location, job.jobType, job.jobLevel, job.salary]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
    };
  }

  // Utility: Normalize and tokenize text into word list
  private tokenize(text: string): string[] {
    return text.toLowerCase().split(/\W+/).map(w => w.trim()).filter(Boolean);
  }

  async screenResumes(jobId: number): Promise<ScreeningResult[]> {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['recruiter'],
    });
    if (!job) throw new NotFoundException('Job not found');

    const applications = await this.applicationRepository.find({
      where: { job: { id: jobId } },
      relations: ['candidate'],
    });
    if (!applications.length) throw new NotFoundException('No applications found for this job');

    const results: ScreeningResult[] = [];

    // Prepare job profile keywords by category
    const { skillsText, experienceText, descriptionText, educationText, otherText } = this.buildJobProfileText(job);
    const skillsKeywords = Array.from(new Set(this.tokenize(skillsText)));
    const experienceKeywords = Array.from(new Set(this.tokenize(experienceText)));
    const descriptionKeywords = Array.from(new Set(this.tokenize(descriptionText)));
    const educationKeywords = Array.from(new Set(this.tokenize(educationText)));
    const otherKeywords = Array.from(new Set(this.tokenize(otherText)));

    for (const application of applications) {
      if (!application.resume) continue;

      try {
        const resumeText = await ResumeParser.parseResume(application.resume);
        const resumeWords = new Set(this.tokenize(resumeText));

        // Calculate matches for each category
        const matchedSkills = skillsKeywords.filter(word => resumeWords.has(word));
        const matchedExperience = experienceKeywords.filter(word => resumeWords.has(word));
        const matchedDescription = descriptionKeywords.filter(word => resumeWords.has(word));
        const matchedEducation = educationKeywords.filter(word => resumeWords.has(word));
        const matchedOther = otherKeywords.filter(word => resumeWords.has(word));

        // Weighted scoring: Skills (35%), Experience (25%), Description (20%), Education (15%), Other (5%)
        const skillsScore = skillsKeywords.length
          ? (matchedSkills.length / skillsKeywords.length) * 50
          : 0;
        const experienceScore = experienceKeywords.length
          ? (matchedExperience.length / experienceKeywords.length) * 15
          : 0;
        const descriptionScore = descriptionKeywords.length
          ? (matchedDescription.length / descriptionKeywords.length) * 15
          : 0;
        const educationScore = educationKeywords.length
          ? (matchedEducation.length / educationKeywords.length) * 15
          : 0;
        const otherScore = otherKeywords.length
          ? (matchedOther.length / otherKeywords.length) * 5
          : 0;

        const totalScore = skillsScore + experienceScore + descriptionScore + educationScore + otherScore;

        // Combine all matched keywords for reporting
        const matchedKeywords = [
          ...matchedSkills,
          ...matchedExperience,
          ...matchedDescription,
          ...matchedEducation,
          ...matchedOther,
        ];

        const result = this.screeningResultRepository.create({
          job,
          candidate: application.candidate,
          score: totalScore,
          matchedKeywords,
        });

        results.push(await this.screeningResultRepository.save(result));

      } catch (error) {
        console.error(`Failed to process resume for candidate ${application.candidate.id}: ${error.message}`);
      }
    }

    // Notify recruiter about top candidate
    if (results.length > 0) {
      const topCandidate = results[0];
      await this.emailService.sendMail(
        job.recruiter.email,
        `Screening Results for Job: ${job.title}`,
        `Screening completed for "${job.title}".\n\nTop candidate scored ${topCandidate.score.toFixed(2)}%.\nMatched keywords: ${topCandidate.matchedKeywords.join(', ')}`,
      );
    }

    // Return results sorted by score
    return results.sort((a, b) => b.score - a.score);
  }
}
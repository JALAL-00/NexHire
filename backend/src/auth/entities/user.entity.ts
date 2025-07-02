import { Column, Entity, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
import { CandidateProfile } from '../../candidate/entities/candidate-profile.entity';
import { Job } from '../../jobs/entities/job.entity';
import { Application } from '../../applications/entities/application.entity';
import { Message } from '../../recruiter/entities/message.entity';
import { ScrapedJob } from '../../scraper/entities/scraped-job.entity';
import { RecruiterProfile } from '../../recruiter/entities/recruiter-profile.entity';
import { Post } from '../../posts/entities/post.entity';


export enum UserRole {
  RECRUITER = 'recruiter',
  CANDIDATE = 'candidate',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date | null;

  @Column({ type: 'boolean', default: false })
  isPremium: boolean;

  @Column({ nullable: true })
  resume: string;

  @OneToOne(() => CandidateProfile, (profile) => profile.user, { cascade: true })
  candidateProfile: CandidateProfile;

  @OneToOne(() => RecruiterProfile, (recruiterProfile) => recruiterProfile.user, { cascade: true })
  recruiterProfile: RecruiterProfile;

  @OneToMany(() => Job, (job) => job.recruiter, { cascade: true })
  jobs: Job[];

  @OneToMany(() => Application, (application) => application.candidate, { cascade: true })
  applications: Application[];

  @OneToMany(() => Message, (message) => message.sender, { cascade: true })
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver, { cascade: true })
  receivedMessages: Message[];

  @OneToMany(() => ScrapedJob, (scrapedJob) => scrapedJob.user)
  scrapedJobs: ScrapedJob[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Job, (job) => job.recruiter)
  postedJobs: Job[];
}
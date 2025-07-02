import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany, // 1. Import OneToMany from typeorm
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';
import { Interview } from '../../interviews/entities/interview.entity';

// It's good practice to use an enum for statuses
export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  job: Job;

  @ManyToOne(() => User, (user) => user.applications)
  candidate: User;

  @OneToMany(() => Interview, (interview) => interview.application)
  interviews: Interview[];

  @Column({ nullable: true })
  resume: string; // Stores the path, e.g., 'uploads/resume-162515...pdf'

  @Column({ type: 'text', nullable: true })
  coverLetter: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @CreateDateColumn() 
  createdAt: Date;
}

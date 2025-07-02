import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Job } from 'src/jobs/entities/job.entity';

interface ExperienceEntry {
  title: string;
  org: string;
  duration: string;
  location: string;
  desc: string;
}

@Entity()
export class CandidateProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.candidateProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  availability: string;

  @Column({ nullable: true })
  location: string;
  
  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ type: 'text', nullable: true })
  services: string;
  
  @Column('simple-array', { nullable: true })
  skills: string[];

  @Column('jsonb', { nullable: true, default: [] })
  experience: ExperienceEntry[];

  @Column('jsonb', { nullable: true, default: [] })
  education: { institution: string; degree: string; year: number }[];

  @Column({ nullable: true })
  resume: string;

  @Column({ default: true })
  isVisible: boolean;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  coverPhoto: string;

  @ManyToMany(() => Job)
  @JoinTable()
  savedJobs: Job[];
}
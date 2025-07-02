export class ScreeningResultEntity {}
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Job } from '../../jobs/entities/job.entity';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class ScreeningResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Job, (job) => job.id)
  job: Job;

  @ManyToOne(() => User, (user) => user.applications)
  candidate: User;

  @Column({ type: 'float' })
  score: number;

  @Column('simple-array', { nullable: true })
  matchedKeywords: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class ScrapedJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column()
  location: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  salary?: string;

  @Column({ nullable: true })
  postedDate?: string;

  @Column()
  url: string;

  @Column()
  source: string;

  @ManyToOne(() => User, (user) => user.scrapedJobs)
  user: User;
}
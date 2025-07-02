import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Application } from '../../applications/entities/application.entity'; 
import { CreateDateColumn } from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  salary: string;

  @Column('simple-array', { nullable: true })
  skills: string[];

  @Column({ nullable: true })
  experience: string;

  @ManyToOne(() => User, (user) => user.jobs)
  recruiter: User;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];

  @Column({ type: 'text', nullable: true })
  responsibilities: string;

  @Column({ type: 'date', nullable: true })
  expirationDate: string;

  @Column({ nullable: true })
  jobType: string;

  @Column({ nullable: true })
  jobLevel: string;

  @Column({ nullable: true })
  education: string;  

  @CreateDateColumn()
  createdAt: Date;
  status: string;
}

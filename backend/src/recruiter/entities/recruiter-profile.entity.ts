import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class RecruiterProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.recruiterProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  coverPhoto: string;

  // --- ✅ NEWLY ADDED FIELDS ---
  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ nullable: true })
  location: string;
}
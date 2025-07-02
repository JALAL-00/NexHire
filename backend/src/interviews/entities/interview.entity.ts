import { Application } from 'src/applications/entities/application.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export enum InterviewType {
  VIDEO_CALL = 'Video Call',
  PHONE_SCREEN = 'Phone Screen',
  ON_SITE = 'On-site',
}

@Entity()
export class Interview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'timestamp with time zone' })
  date: Date;

  @Column({
    type: 'enum',
    enum: InterviewType,
    default: InterviewType.VIDEO_CALL,
  })
  type: InterviewType;

  @Column({ nullable: true })
  locationOrLink: string; 

  @Column({ type: 'text', nullable: true })
  notes: string; 

  @ManyToOne(() => Application, (application) => application.interviews)
  application: Application;
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Conversation } from './conversation.entity';

// --- ADD THIS ENUM ---
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  // --- MAKE CONTENT NULLABLE ---
  @Column('text', { nullable: true })
  content: string;

  // --- ADD NEW COLUMNS FOR MEDIA ---
  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  type: MessageType;

  @Column({ nullable: true })
  mediaUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { eager: true }) 
  sender: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;
}
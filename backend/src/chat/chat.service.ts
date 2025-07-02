import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../auth/entities/user.entity';
import { Conversation } from './entities/conversation.entity';
import { ChatUserDto, MessageDto } from './dto/chat-user.dto';
import { Message, MessageType } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Conversation) private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
  ) {}

  // ... (getUsersForChat, findOrCreateConversation, and getMessages methods are correct and remain unchanged) ...

  async getUsersForChat(currentUser: User): Promise<ChatUserDto[]> {
    const targetRole = currentUser.role === UserRole.CANDIDATE ? UserRole.RECRUITER : UserRole.CANDIDATE;
    
    const query = this.userRepository.createQueryBuilder('user')
      .where('user.role = :targetRole', { targetRole });

    if (targetRole === UserRole.CANDIDATE) {
      query.leftJoinAndSelect('user.candidateProfile', 'candidateProfile');
    } else {
      query.leftJoinAndSelect('user.recruiterProfile', 'recruiterProfile');
    }

    const users = await query.getMany();
    
    return users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.candidateProfile?.profilePicture || user.recruiterProfile?.profilePicture || null,
    }));
  }
  
  async findOrCreateConversation(user1: User, user2Id: number): Promise<Conversation> {
    const user2 = await this.userRepository.findOneBy({ id: user2Id });
    if (!user2) throw new NotFoundException('Recipient user not found');

    const queryBuilder = this.conversationRepository.createQueryBuilder('conversation')
      .leftJoin('conversation.participants', 'participant')
      .where('participant.id IN (:...userIds)', { userIds: [user1.id, user2Id] })
      .groupBy('conversation.id')
      .having('COUNT(conversation.id) = 2');

    let conversation = await queryBuilder.getOne();

    if (!conversation) {
      const newConversation = this.conversationRepository.create({
        participants: [user1, user2],
      });
      conversation = await this.conversationRepository.save(newConversation);
    }
    
    const fullConversation = await this.conversationRepository.findOne({
        where: { id: conversation.id },
        relations: ['participants', 'participants.candidateProfile', 'participants.recruiterProfile'],
    });

    if (!fullConversation) {
      throw new InternalServerErrorException('Could not load conversation after finding/creating it.');
    }

    fullConversation.participants = fullConversation.participants.map(p => ({
      ...p,
      profilePicture: p.candidateProfile?.profilePicture || p.recruiterProfile?.profilePicture || null,
    })) as User[];

    return fullConversation;
  }

  async getMessages(conversationId: number): Promise<MessageDto[]> {
    const messages = await this.messageRepository.createQueryBuilder('message')
      .innerJoin('message.conversation', 'conversation')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('sender.candidateProfile', 'candidateProfile')
      .leftJoinAndSelect('sender.recruiterProfile', 'recruiterProfile')
      .where('conversation.id = :conversationId', { conversationId })
      .orderBy('message.createdAt', 'ASC')
      .getMany();
      
    return messages.map(message => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      type: message.type,
      mediaUrl: message.mediaUrl,
      conversation: { id: conversationId },
      sender: {
        id: message.sender.id,
        firstName: message.sender.firstName,
        lastName: message.sender.lastName,
        email: message.sender.email,
        profilePicture: message.sender.candidateProfile?.profilePicture || message.sender.recruiterProfile?.profilePicture || null,
      }
    }));
  }
  
  async createMessage(
    sender: User,
    conversationId: number,
    content: string | null,
    type: MessageType = MessageType.TEXT,
    mediaUrl: string | null = null,
  ): Promise<MessageDto> {
    const conversation = await this.conversationRepository.findOneBy({ id: conversationId });
    if (!conversation) throw new NotFoundException('Conversation not found');

    // --- FIX 1: This part is now correct ---
    const message = this.messageRepository.create({
      content,
      sender,
      conversation,
      type,
      mediaUrl,
    } as Partial<Message>);
    // Ensure message is a single object, not an array
    const savedMessage = await this.messageRepository.save(message);

    const fullSender = await this.userRepository.findOne({
      where: { id: sender.id },
      relations: ['candidateProfile', 'recruiterProfile'],
    });
    
    if (!fullSender) {
        throw new NotFoundException(`Sender with ID ${sender.id} not found.`);
    }
    
    // --- FIX 2: Correctly populate the DTO with all required fields ---
    const finalMessage: MessageDto = {
      id: savedMessage.id,
      content: savedMessage.content,
      type: savedMessage.type,
      mediaUrl: savedMessage.mediaUrl,
      createdAt: savedMessage.createdAt,
      conversation: { id: conversationId },
      sender: {
        id: fullSender.id,
        firstName: fullSender.firstName,
        lastName: fullSender.lastName,
        email: fullSender.email,
        profilePicture: fullSender.candidateProfile?.profilePicture || fullSender.recruiterProfile?.profilePicture || null,
      },
    };

    return finalMessage;
  }
}
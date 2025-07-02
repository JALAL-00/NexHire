import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Conversation } from './entities/conversation.entity';
import { ChatUserDto, MessageDto } from './dto/chat-user.dto';
import { Message, MessageType } from './entities/message.entity';
export declare class ChatService {
    private readonly userRepository;
    private readonly conversationRepository;
    private readonly messageRepository;
    constructor(userRepository: Repository<User>, conversationRepository: Repository<Conversation>, messageRepository: Repository<Message>);
    getUsersForChat(currentUser: User): Promise<ChatUserDto[]>;
    findOrCreateConversation(user1: User, user2Id: number): Promise<Conversation>;
    getMessages(conversationId: number): Promise<MessageDto[]>;
    createMessage(sender: User, conversationId: number, content: string | null, type?: MessageType, mediaUrl?: string | null): Promise<MessageDto>;
}

import { ChatService } from './chat.service';
import { RequestWithUser } from '../common/types/request-with-user.interface';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    uploadChatFile(file: Express.Multer.File): {
        filePath: string;
    };
    getUsersForChat(req: RequestWithUser): Promise<import("./dto/chat-user.dto").ChatUserDto[]>;
    findOrCreateConversation(req: RequestWithUser, recipientId: number): Promise<import("./entities/conversation.entity").Conversation>;
    getMessages(id: number): Promise<import("./dto/chat-user.dto").MessageDto[]>;
}

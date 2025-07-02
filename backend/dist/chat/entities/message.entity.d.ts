import { User } from '../../auth/entities/user.entity';
import { Conversation } from './conversation.entity';
export declare enum MessageType {
    TEXT = "text",
    IMAGE = "image",
    VIDEO = "video",
    FILE = "file"
}
export declare class Message {
    id: number;
    content: string;
    type: MessageType;
    mediaUrl: string;
    createdAt: Date;
    sender: User;
    conversation: Conversation;
}

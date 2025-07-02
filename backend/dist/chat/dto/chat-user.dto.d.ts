import { MessageType } from "../entities/message.entity";
export declare class ChatUserDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string | null;
}
export declare class MessageDto {
    id: number;
    content: string | null;
    createdAt: Date;
    sender: ChatUserDto;
    conversation: {
        id: number;
    };
    type: MessageType;
    mediaUrl: string | null;
}

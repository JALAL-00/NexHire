import { MessageType } from "../entities/message.entity";

// This DTO represents a user as seen in the chat contact list or as a message sender
export class ChatUserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null;
}

// This DTO represents a message being sent over the network
export class MessageDto {
  id: number;
  content: string | null; // Content can be null for media messages
  createdAt: Date;
  sender: ChatUserDto; 
  conversation: { id: number };

  // --- ADD THESE MISSING PROPERTIES ---
  type: MessageType;
  mediaUrl: string | null;
}
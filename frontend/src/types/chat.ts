export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
}

export interface ChatUser {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
}

export interface Message {
  id: number;
  content: string | null;
  createdAt: string;
  sender: ChatUser;
  conversation: { id: number };
  type: MessageType;
  mediaUrl: string | null;
}

export interface Conversation {
  id: number;
  participants: ChatUser[];
  messages: Message[];
}
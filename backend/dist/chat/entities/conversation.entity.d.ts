import { User } from '../../auth/entities/user.entity';
import { Message } from './message.entity';
export declare class Conversation {
    id: number;
    participants: User[];
    messages: Message[];
}

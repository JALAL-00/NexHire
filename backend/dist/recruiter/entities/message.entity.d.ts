import { User } from '../../auth/entities/user.entity';
export declare class Message {
    id: number;
    content: string;
    sender: User;
    receiver: User;
    createdAt: Date;
}

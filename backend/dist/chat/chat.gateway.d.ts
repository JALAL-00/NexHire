import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { SocketWithUser } from '../common/types/socket-with-user.interface';
import { MessageType } from './entities/message.entity';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private readonly authService;
    private readonly jwtService;
    server: Server;
    constructor(chatService: ChatService, authService: AuthService, jwtService: JwtService);
    handleConnection(client: SocketWithUser): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: SocketWithUser, conversationId: number): void;
    handleMessage(client: SocketWithUser, payload: {
        conversationId: number;
        content: string | null;
        type?: MessageType;
        mediaUrl?: string;
    }): Promise<void>;
}

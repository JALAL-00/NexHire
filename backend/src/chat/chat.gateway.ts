import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt'; 
import { SocketWithUser } from '../common/types/socket-with-user.interface'; 
import { MessageType } from './entities/message.entity';

@WebSocketGateway({ cors: { origin: 'http://localhost:3001' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService, 
  ) {}

  async handleConnection(client: SocketWithUser) { 
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('No token provided');

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET, 
      });
      
      const user = await this.authService.validateUserFromPayload(payload);
      if (!user) throw new Error('Invalid user in token');
      
      client.data.user = user;
      console.log(`Client connected: ${client.id}, User: ${user.email}`); 
    } catch (error) {
      console.error('Authentication failed:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: SocketWithUser, // <-- USE custom socket type
    @MessageBody() conversationId: number,
  ) {
    const roomName = `conversation-${conversationId}`;
    client.join(roomName);
    console.log(`User ${client.data.user.email} joined room: ${roomName}`);
  }

@SubscribeMessage('sendMessage')
async handleMessage(
  @ConnectedSocket() client: SocketWithUser,
  // --- UPDATE THE PAYLOAD STRUCTURE ---
  @MessageBody() payload: { 
    conversationId: number; 
    content: string | null;
    type?: MessageType;
    mediaUrl?: string;
  },
) {
  const user = client.data.user;
  const { conversationId, content, type, mediaUrl } = payload;
  
  // --- PASS NEW PARAMS TO THE SERVICE ---
  const message = await this.chatService.createMessage(user, conversationId, content, type, mediaUrl);

  const roomName = `conversation-${conversationId}`;
  this.server.to(roomName).emit('newMessage', message);
}
}
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

@WebSocketGateway({
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://nexhire.up.railway.app',
        'https://nexhire-backend-api.up.railway.app',
        process.env.FRONTEND_URL,
      ].filter(Boolean);

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️ Blocked CORS request from origin: ${origin}`);
        callback(null, true); // Allow in production for now, change to false for strict security
      }
    },
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }

  async handleConnection(client: SocketWithUser) {
    try {
      console.log('🔌 New WebSocket connection attempt:', {
        id: client.id,
        transport: client.conn.transport.name,
        origin: client.handshake.headers.origin,
      });

      const token = client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        console.error('❌ No token provided in connection');
        throw new Error('No token provided');
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.authService.validateUserFromPayload(payload);
      if (!user) {
        console.error('❌ Invalid user in token');
        throw new Error('Invalid user in token');
      }

      client.data.user = user;
      console.log(`✅ Client connected successfully: ${client.id}, User: ${user.email}`);
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
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
    try {
      const user = client.data.user;
      const { conversationId, content, type, mediaUrl } = payload;

      console.log('📨 Sending message:', {
        userId: user.id,
        userEmail: user.email,
        conversationId,
        contentLength: content?.length || 0,
        type: type || MessageType.TEXT,
        hasMedia: !!mediaUrl,
      });

      // --- PASS NEW PARAMS TO THE SERVICE ---
      const message = await this.chatService.createMessage(user, conversationId, content, type, mediaUrl);

      const roomName = `conversation-${conversationId}`;
      this.server.to(roomName).emit('newMessage', message);

      console.log(`✅ Message sent to room ${roomName}:`, {
        messageId: message.id,
        senderId: message.sender.id,
      });
    } catch (error) {
      console.error('❌ Error sending message:', error.message);
      console.error('Error details:', error);
      client.emit('messageError', { error: error.message });
    }
  }
}
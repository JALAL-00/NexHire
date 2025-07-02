import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { RequestWithUser } from '../common/types/request-with-user.interface'; 
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { chatMulterOptions } from './chat-multer.config';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', chatMulterOptions))
  uploadChatFile(@UploadedFile() file: Express.Multer.File) {
    // We just need to return the path where Multer saved the file.
    return { filePath: file.path };
  }

  @Get('users')
  getUsersForChat(@Req() req: RequestWithUser) { 
    return this.chatService.getUsersForChat(req.user);
  }

  @Post('conversations')
  findOrCreateConversation(@Req() req: RequestWithUser, @Body('recipientId') recipientId: number) { // <-- USE THE CUSTOM TYPE
    return this.chatService.findOrCreateConversation(req.user, recipientId);
  }

  @Get('conversations/:id/messages')
  getMessages(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.getMessages(id);
  }
}
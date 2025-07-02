// src/nexi-ai/nexi-ai.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService, AiTool } from './nexi-ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class AssistantDto {
  userInput: string;
}

@Controller('ai') // <-- This is the first part of the path
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('assistant') // <-- This is the second part of the path
  async handleAssistantRequest(@Body() assistantDto: AssistantDto) {
    const { userInput } = assistantDto;
    return this.aiService.routeRequest(userInput);
  }
}
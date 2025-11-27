// src/nexi-ai/nexi-ai.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

export enum AiTool {
  CoverLetter = 'COVER_LETTER_GENERATION',
  JobDescription = 'JOB_DESCRIPTION_ENHANCEMENT',
  SemanticSearch = 'SEMANTIC_JOB_SEARCH',
  CodeGeneration = 'CODE_GENERATION',
  GeneralChat = 'GENERAL_CHAT',
}

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  // --- SOLUTION: Use the standard, most stable model guaranteed to work with a free AI Studio key ---
  private modelName = 'gemini-2.5-flash';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error('FATAL_ERROR: GOOGLE_API_KEY is not set in the environment variables.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async routeRequest(userInput: string): Promise<{ tool: AiTool; response: string }> {
    const classificationPrompt = `
      Based on the user's request, classify it into one of the following categories: 
      '${AiTool.CoverLetter}', '${AiTool.JobDescription}', '${AiTool.SemanticSearch}', '${AiTool.CodeGeneration}', or '${AiTool.GeneralChat}'.
      User request: "${userInput}"
      Return only the category name, without any other text or formatting.
    `;
    
    const tool = await this.classifyIntent(classificationPrompt).catch(() => AiTool.GeneralChat);
    let response = '';

    switch (tool) {
      case AiTool.CoverLetter:
        response = await this.generateWithTool(userInput, 'act as a cover letter writing assistant');
        break;
      // ... other cases are the same ...
      default:
        response = await this.generateWithTool(userInput, 'act as a helpful career assistant named Nexi');
        break;
    }

    return { tool, response };
  }

  private async classifyIntent(prompt: string): Promise<AiTool> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });
      const result = await model.generateContent(prompt);
      const classification = (await result.response.text()).trim();
      
      if (Object.values(AiTool).includes(classification as AiTool)) {
        return classification as AiTool;
      }
      return AiTool.GeneralChat;
    } catch (error) {
      console.error('Intent classification failed:', error);
      return AiTool.GeneralChat; // Default on error
    }
  }

  private async generateWithTool(prompt: string, systemInstruction: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.modelName,
        systemInstruction: `You are Nexi, a helpful AI career assistant. Your current task is to ${systemInstruction}.`,
      });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('AI tool generation failed:', error);
      throw new InternalServerErrorException('Failed to get a response from the AI. The API key may be invalid or the service may be down.');
    }
  }
}
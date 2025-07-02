// src/nexi-ai/nexi-ai.module.ts
import { Module } from '@nestjs/common';
import { AiService } from './nexi-ai.service'; // Corrected path
import { AiController } from './nexi-ai.controller'; // Corrected path
import { ConfigModule } from '@nestjs/config'; // <-- FIX: IMPORT THIS

@Module({
  imports: [ConfigModule], // <-- FIX: ADD THIS TO THE IMPORTS ARRAY
  controllers: [AiController],
  providers: [AiService],
})
export class NexiAiModule {}
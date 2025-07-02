import { AiService, AiTool } from './nexi-ai.service';
declare class AssistantDto {
    userInput: string;
}
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    handleAssistantRequest(assistantDto: AssistantDto): Promise<{
        tool: AiTool;
        response: string;
    }>;
}
export {};

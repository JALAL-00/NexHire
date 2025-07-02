import { ConfigService } from '@nestjs/config';
export declare enum AiTool {
    CoverLetter = "COVER_LETTER_GENERATION",
    JobDescription = "JOB_DESCRIPTION_ENHANCEMENT",
    SemanticSearch = "SEMANTIC_JOB_SEARCH",
    CodeGeneration = "CODE_GENERATION",
    GeneralChat = "GENERAL_CHAT"
}
export declare class AiService {
    private configService;
    private genAI;
    private modelName;
    constructor(configService: ConfigService);
    routeRequest(userInput: string): Promise<{
        tool: AiTool;
        response: string;
    }>;
    private classifyIntent;
    private generateWithTool;
}

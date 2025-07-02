"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = exports.AiTool = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
const config_1 = require("@nestjs/config");
var AiTool;
(function (AiTool) {
    AiTool["CoverLetter"] = "COVER_LETTER_GENERATION";
    AiTool["JobDescription"] = "JOB_DESCRIPTION_ENHANCEMENT";
    AiTool["SemanticSearch"] = "SEMANTIC_JOB_SEARCH";
    AiTool["CodeGeneration"] = "CODE_GENERATION";
    AiTool["GeneralChat"] = "GENERAL_CHAT";
})(AiTool || (exports.AiTool = AiTool = {}));
let AiService = class AiService {
    configService;
    genAI;
    modelName = 'gemini-1.5-flash-latest';
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GOOGLE_API_KEY');
        if (!apiKey) {
            throw new Error('FATAL_ERROR: GOOGLE_API_KEY is not set in the environment variables.');
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    async routeRequest(userInput) {
        const classificationPrompt = `
      Based on the user's request, classify it into one of the following categories: 
      '${AiTool.CoverLetter}', '${AiTool.JobDescription}', '${AiTool.SemanticSearch}', '${AiTool.CodeGeneration}', or '${AiTool.GeneralChat}'.
      User request: "${userInput}"
      Return only the category name, without any other text or formatting.
    `;
        const tool = await this.classifyIntent(classificationPrompt);
        let response = '';
        switch (tool) {
            case AiTool.CoverLetter:
                response = await this.generateWithTool(userInput, 'act as a cover letter writing assistant');
                break;
            default:
                response = await this.generateWithTool(userInput, 'act as a helpful career assistant named Nexi');
                break;
        }
        return { tool, response };
    }
    async classifyIntent(prompt) {
        try {
            const model = this.genAI.getGenerativeModel({ model: this.modelName });
            const result = await model.generateContent(prompt);
            const classification = (await result.response.text()).trim();
            if (Object.values(AiTool).includes(classification)) {
                return classification;
            }
            return AiTool.GeneralChat;
        }
        catch (error) {
            console.error('Intent classification failed:', error);
            return AiTool.GeneralChat;
        }
    }
    async generateWithTool(prompt, systemInstruction) {
        try {
            const model = this.genAI.getGenerativeModel({
                model: this.modelName,
                systemInstruction: `You are Nexi, a helpful AI career assistant. Your current task is to ${systemInstruction}.`,
            });
            const result = await model.generateContent(prompt);
            return result.response.text();
        }
        catch (error) {
            console.error('AI tool generation failed:', error);
            throw new common_1.InternalServerErrorException('Failed to get a response from the AI. The API key may be invalid or the service may be down.');
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=nexi-ai.service.js.map
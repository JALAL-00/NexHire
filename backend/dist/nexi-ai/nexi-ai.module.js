"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NexiAiModule = void 0;
const common_1 = require("@nestjs/common");
const nexi_ai_service_1 = require("./nexi-ai.service");
const nexi_ai_controller_1 = require("./nexi-ai.controller");
const config_1 = require("@nestjs/config");
let NexiAiModule = class NexiAiModule {
};
exports.NexiAiModule = NexiAiModule;
exports.NexiAiModule = NexiAiModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [nexi_ai_controller_1.AiController],
        providers: [nexi_ai_service_1.AiService],
    })
], NexiAiModule);
//# sourceMappingURL=nexi-ai.module.js.map
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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
    configService;
    transporter;
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get('GMAIL_USER'),
                pass: this.configService.get('GMAIL_PASS'),
            },
        });
    }
    async sendMail(to, subject, text) {
        const mailOptions = {
            from: this.configService.get('GMAIL_USER'),
            to,
            subject,
            text,
        };
        await this.transporter.sendMail(mailOptions);
    }
    async sendNewProjectNotification(to, project) {
        const subject = `New Project Opportunity: ${project.title}`;
        const text = `
      A new project has been posted that matches your skills!
      Title: ${project.title}
      Description: ${project.description}
      Required Skills: ${project.requiredSkills.join(', ')}
      Check it out on the Job Portal!
    `;
        await this.sendMail(to, subject, text);
    }
    async sendApplicationUpdateNotification(to, projectTitle, status, isOwner) {
        const subject = `Project Application Update: ${projectTitle}`;
        const text = isOwner
            ? `A new application has been submitted for your project "${projectTitle}". Review it on the Job Portal.`
            : `Your application for "${projectTitle}" has been ${status}. Check the details on the Job Portal.`;
        await this.sendMail(to, subject, text);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map
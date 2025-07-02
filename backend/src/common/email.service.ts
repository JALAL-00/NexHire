// src/common/email.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('GMAIL_USER'),
      to,
      subject,
      text,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendNewProjectNotification(to: string, project: { title: string; description: string; requiredSkills: string[] }) {
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

  async sendApplicationUpdateNotification(to: string, projectTitle: string, status: string, isOwner: boolean) {
    const subject = `Project Application Update: ${projectTitle}`;
    const text = isOwner
      ? `A new application has been submitted for your project "${projectTitle}". Review it on the Job Portal.`
      : `Your application for "${projectTitle}" has been ${status}. Check the details on the Job Portal.`;
    await this.sendMail(to, subject, text);
  }
}
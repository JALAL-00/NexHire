// src/common/email.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private fromEmail: string;

  constructor(private configService: ConfigService) {
    const sendGridApiKey = this.configService.get<string>('SENDGRID_API_KEY');

    if (!sendGridApiKey) {
      console.error('❌ SENDGRID_API_KEY is missing in environment variables!');
      console.error('📧 Email service will not work. Please add SENDGRID_API_KEY to your environment.');
    } else {
      sgMail.setApiKey(sendGridApiKey);
      console.log('✅ SendGrid email service configured successfully');
    }

    this.fromEmail = this.configService.get<string>('FROM_EMAIL') || 'noreply@yourdomain.com';
  }

  /**
   * Send email with both text and HTML support
   * @param to Recipient email address
   * @param subject Email subject
   * @param text Plain text content
   * @param html HTML content (optional)
   * @param retries Number of retry attempts (default: 3)
   */
  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
    retries: number = 3
  ): Promise<void> {
    const msg = {
      to,
      from: `NexHire <${this.fromEmail}>`,
      subject,
      text,
      html: html || this.wrapInHtmlTemplate(text),
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await sgMail.send(msg);
        console.log(`✅ Email sent successfully to ${to}`);
        return;
      } catch (error) {
        console.error(`❌ Email send attempt ${attempt}/${retries} failed:`, error.message);

        if (attempt === retries) {
          console.error(`❌ Failed to send email to ${to} after ${retries} attempts`);
          throw new InternalServerErrorException('Failed to send email. Please try again later.');
        }

        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  /**
   * Wrap plain text in a professional HTML template
   */
  private wrapInHtmlTemplate(text: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 2px solid #4F46E5;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #4F46E5;
            }
            .content {
              white-space: pre-wrap;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">NexHire</div>
            </div>
            <div class="content">${text.replace(/\n/g, '<br>')}</div>
            <div class="footer">
              <p>This is an automated message from NexHire. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} NexHire. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Send password reset OTP email
   */
  async sendPasswordResetOTP(to: string, otp: string): Promise<void> {
    const subject = 'NexHire Password Reset OTP';
    const text = `Your OTP for password reset is: ${otp}\n\nThis OTP will expire in 5 minutes.\n\nIf you didn't request this, please ignore this email.`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .otp-box { background: white; border: 2px dashed #4F46E5; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 8px; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
            .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password. Use the OTP below to complete the process:</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; color: #6b7280;">This code expires in 5 minutes</p>
              </div>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email and ensure your account is secure.
              </div>
              <p>Best regards,<br><strong>The NexHire Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} NexHire. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendMail(to, subject, text, html);
  }

  /**
   * Send new job application notification to recruiter
   */
  async sendNewApplicationNotification(
    recruiterEmail: string,
    jobTitle: string,
    candidateName: string,
    candidateEmail: string
  ): Promise<void> {
    const subject = `New Application for ${jobTitle}`;
    const text = `Hello,\n\nGood news! A new candidate has applied for your job posting.\n\nJob: ${jobTitle}\nCandidate: ${candidateName}\nEmail: ${candidateEmail}\n\nLog in to your NexHire dashboard to review the application.\n\nBest regards,\nThe NexHire Team`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .info-box { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .info-row { display: flex; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .info-label { font-weight: bold; color: #4F46E5; width: 120px; }
            .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎉 New Job Application!</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Great news! A new candidate has applied for your job posting.</p>
              <div class="info-box">
                <div class="info-row">
                  <span class="info-label">Job Title:</span>
                  <span>${jobTitle}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Candidate:</span>
                  <span>${candidateName}</span>
                </div>
                <div class="info-row" style="border-bottom: none;">
                  <span class="info-label">Email:</span>
                  <span>${candidateEmail}</span>
                </div>
              </div>
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'https://nexhire.up.railway.app'}/recruiter/applications" class="button">Review Application</a>
              </p>
              <p>Best regards,<br><strong>The NexHire Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} NexHire. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendMail(recruiterEmail, subject, text, html);
  }

  /**
   * Send application status update to candidate
   */
  async sendApplicationStatusUpdate(
    candidateEmail: string,
    jobTitle: string,
    status: string
  ): Promise<void> {
    const statusEmoji = status === 'accepted' ? '✅' : status === 'rejected' ? '❌' : '📋';
    const statusColor = status === 'accepted' ? '#10b981' : status === 'rejected' ? '#ef4444' : '#f59e0b';

    const subject = `Application Status Update: ${jobTitle}`;
    const text = `Hello,\n\nYour application for "${jobTitle}" has been updated.\n\nNew Status: ${status.toUpperCase()}\n\nLog in to your NexHire dashboard for more details.\n\nBest regards,\nThe NexHire Team`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .status-box { background: white; border-radius: 8px; padding: 30px; margin: 20px 0; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .status-badge { display: inline-block; background: ${statusColor}; color: white; padding: 10px 20px; border-radius: 20px; font-weight: bold; font-size: 18px; }
            .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">${statusEmoji} Application Status Update</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We have an update regarding your application for:</p>
              <div class="status-box">
                <h2 style="margin: 0 0 20px 0; color: #1f2937;">${jobTitle}</h2>
                <div class="status-badge">${status.toUpperCase()}</div>
              </div>
              <p>Log in to your NexHire dashboard for more details and next steps.</p>
              <p>Best regards,<br><strong>The NexHire Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} NexHire. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendMail(candidateEmail, subject, text, html);
  }

  /**
   * Send resume screening results to recruiter
   */
  async sendScreeningResults(
    recruiterEmail: string,
    jobTitle: string,
    topCandidateScore: number,
    matchedKeywords: string[],
    totalCandidates: number
  ): Promise<void> {
    const subject = `Resume Screening Complete: ${jobTitle}`;
    const text = `Hello,\n\nResume screening has been completed for your job posting "${jobTitle}".\n\nResults Summary:\n- Total Candidates Screened: ${totalCandidates}\n- Top Candidate Score: ${topCandidateScore.toFixed(2)}%\n- Matched Keywords: ${matchedKeywords.slice(0, 10).join(', ')}\n\nLog in to your dashboard to view detailed results and shortlist candidates.\n\nBest regards,\nThe NexHire Team`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .results-box { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .stat { display: inline-block; background: #ede9fe; padding: 15px 20px; border-radius: 8px; margin: 10px; text-align: center; }
            .stat-value { font-size: 24px; font-weight: bold; color: #4F46E5; }
            .stat-label { font-size: 12px; color: #6b7280; }
            .keywords { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .keyword-tag { display: inline-block; background: #4F46E5; color: white; padding: 5px 10px; border-radius: 4px; margin: 3px; font-size: 12px; }
            .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎯 Resume Screening Complete!</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Great news! Resume screening has been completed for your job posting:</p>
              <h3 style="color: #4F46E5; text-align: center;">${jobTitle}</h3>
              <div class="results-box">
                <div style="text-align: center;">
                  <div class="stat">
                    <div class="stat-value">${totalCandidates}</div>
                    <div class="stat-label">Candidates Screened</div>
                  </div>
                  <div class="stat">
                    <div class="stat-value">${topCandidateScore.toFixed(1)}%</div>
                    <div class="stat-label">Top Match Score</div>
                  </div>
                </div>
                <div class="keywords">
                  <strong>Top Matched Keywords:</strong><br>
                  ${matchedKeywords.slice(0, 10).map(kw => `<span class="keyword-tag">${kw}</span>`).join('')}
                </div>
              </div>
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'https://nexhire.up.railway.app'}/recruiter/screening" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0;">View Detailed Results</a>
              </p>
              <p>Best regards,<br><strong>The NexHire Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} NexHire. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendMail(recruiterEmail, subject, text, html);
  }

  /**
   * Legacy method for backward compatibility
   */
  async sendNewProjectNotification(to: string, project: { title: string; description: string; requiredSkills: string[] }) {
    const subject = `New Project Opportunity: ${project.title}`;
    const text = `A new project has been posted that matches your skills!\n\nTitle: ${project.title}\nDescription: ${project.description}\nRequired Skills: ${project.requiredSkills.join(', ')}\n\nCheck it out on NexHire!`;
    await this.sendMail(to, subject, text);
  }

  /**
   * Legacy method for backward compatibility
   */
  async sendApplicationUpdateNotification(to: string, projectTitle: string, status: string, isOwner: boolean) {
    const subject = `Project Application Update: ${projectTitle}`;
    const text = isOwner
      ? `A new application has been submitted for your project "${projectTitle}". Review it on NexHire.`
      : `Your application for "${projectTitle}" has been ${status}. Check the details on NexHire.`;
    await this.sendMail(to, subject, text);
  }
}
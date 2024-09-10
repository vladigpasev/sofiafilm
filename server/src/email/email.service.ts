import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_SERVER_HOST'),
      port: this.configService.get<number>('EMAIL_SERVER_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_SERVER_USER'),
        pass: this.configService.get<string>('EMAIL_SERVER_PASSWORD'),
      },
    });
  }

  // Email Template: Global Styling for all emails
  private getTemplate(content: string, title: string): string {
    return `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 20px; background-color: #4CAF50; color: white; border-top-left-radius: 8px; border-top-right-radius: 8px;">
              <h1 style="margin: 0; font-size: 24px;">${title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 16px; color: #333333;">${content}</p>
              <br>
              <p style="font-size: 14px; color: #666666;">Best regards,<br>Sofia Film Event Team</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f4f4f4; padding: 20px; text-align: center; color: #666666; font-size: 12px;">
              <p style="margin: 0;">Sofia Film Event | Address: 123 Main Street, Sofia, Bulgaria</p>
              <p style="margin: 0;">Follow us on <a href="https://twitter.com" style="color: #4CAF50; text-decoration: none;">Twitter</a> | <a href="https://facebook.com" style="color: #4CAF50; text-decoration: none;">Facebook</a></p>
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  // Confirmation Email (After Payment)
  async sendConfirmationEmail(to: string) {
    const content = `
      Thank you for your payment! Please fill out the form to complete your registration for the Sofia Film Event.<br><br>
      <a href="your-google-form-link" style="display: inline-block; padding: 10px 20px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Fill Out Form</a>
    `;

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject: 'Event Registration Confirmation',
      html: this.getTemplate(content, 'Registration Confirmed!'),
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Approval Email
  async sendApprovalEmail(to: string) {
    const content = `
      Congratulations! You have been approved to attend the Sofia Film Event.<br><br>
      We look forward to seeing you at the event. Please bring a valid ID and your ticket for verification.<br><br>
      <strong>Date:</strong> September 12, 2024<br>
      <strong>Location:</strong> Sofia, Bulgaria
    `;

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject: 'You Are Approved!',
      html: this.getTemplate(content, 'You Are Approved!'),
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Disapproval Email
  async sendDisapprovalEmail(to: string) {
    const content = `
      Unfortunately, we regret to inform you that your application for the Sofia Film Event has been disapproved.<br><br>
      If you have any questions, feel free to contact us at support@sofiafilm.bg.
    `;

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject: 'Application Disapproved',
      html: this.getTemplate(content, 'Application Disapproved'),
    };

    await this.transporter.sendMail(mailOptions);
  }
}

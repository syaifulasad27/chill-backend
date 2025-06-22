import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class EmailService {
  private readonly oauth2Client: OAuth2Client;
  private readonly REFRESH_TOKEN =
    '1//0g8Mc4EAL_oTQCgYIARAAGBASNwF-L9IrEBO7lrf3-4CXaPd83wEWUpQpXmPe7NItqeVYjyKqq5z0OguxzNTCE0P1tbBpMhRFAKU';

  constructor(private configService: ConfigService) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.configService.get<string>('BASE_URL'),
    );

    this.oauth2Client.setCredentials({
      refresh_token: this.REFRESH_TOKEN,
    });
  }

  private async createTransporter() {
    const accessToken = await this.oauth2Client.getAccessToken();

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get<string>('SMTP_USER'),
        clientId: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        clientSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        refreshToken: this.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
      const transporter = await this.createTransporter();
      const verificationUrl = `${this.configService.get<string>('BASE_URL')}/auth/verify-email?token=${token}`;

      await transporter.sendMail({
        from: `"${this.configService.get<string>('EMAIL_FROM')}" <${this.configService.get<string>('SMTP_USER')}>`,
        to: email,
        subject: 'Email Verification for Chill App',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4a6baf;">Welcome to Chill App!</h1>
            <p>Please click the button below to verify your email address:</p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4a6baf; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }
}

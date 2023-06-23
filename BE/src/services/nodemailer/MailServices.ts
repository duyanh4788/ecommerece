import nodemailer from 'nodemailer';
import { isDevelopment } from '../../server';
import { UserAttributes } from '../../interface/UserInterface';
import { INodeMailerServices } from '../../repository/INodeMailerServices';

export class NodeMailerServices implements INodeMailerServices {
  private nodemailerTransport!: nodemailer.Transporter;
  private readonly BASE_URL: string | undefined = process.env.APP_URL;

  constructor() {
    this.startNodeMailer();
  }

  async startNodeMailer() {
    this.nodemailerTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'duyanh4788@gmail.com',
        pass: 'lqsceqququpalcvj'
      }
    });
    this.nodemailerTransport.verify((error, success) => {
      if (error) {
        console.log('Mail server connection failed', error);
      } else {
        console.log('Mail server connection is running', success);
      }
    });
  }

  async sendWelcomeUserNotification(user: UserAttributes, authCode: string): Promise<void> {
    const baseMail = `
        <div style='overflow-wrap: break-word; background-color:#ffffff; line-height: 140%; padding: 30px;'>
          <h1>Welcome</h1>
          <p>You are one step away from your brand new Ecommerce account !</p>
          <p>To access all of ChatApp’s amazing features, <br>get started by verifying your email.</br></p>
          <a href='${this.BASE_URL}?authCode=${authCode}'><strong>Verify your account</strong></a>
          <p>See you there,<br> Your friends at Ecommerce<br></p>
        </div>
      `;
    await this.sendMail(user.email as string, 'Welcome to System Ecommerce By duyanh4788', this.renderHtmlMailServices(baseMail, 'Welcome to System Ecommerce By duyanh4788'));
    return;
  }

  async sendAuthCodeResetPassWord(user: UserAttributes, authCode: string): Promise<void> {
    const baseMail = `
        <div style='overflow-wrap: break-word; background-color:#ffffff; line-height: 140%; padding: 30px;'>
          <h1>Hi ${user.fullName}.</h1>
          <p>You has ordered reset password in Ecommerce account !</p>
          <p>To reset password of Ecommerce, <br>get this code and started reset password.</br></p>
          <p style='border: 1px solid #e7e2e2;font-size: 40px;font-weight: bolder; border-radius: 10px;padding: 15px;width: 160px'>
            ${authCode}
          </p>
          <p>See you there,<br> Your friends at Ecommerce<br></p>
        </div>
      `;
    await this.sendMail(user.email as string, 'System Ecommerce send auth code for reset password', this.renderHtmlMailServices(baseMail, 'Verify Your ChatApp PassWord'));
    return;
  }

  async sendAuthCodeForLogin(user: UserAttributes, authCode: string): Promise<void> {
    const baseMail = `
        <div style='overflow-wrap: break-word; background-color:#ffffff; line-height: 140%; padding: 30px;'>
          <h1>Hi ${user.fullName}.</h1>
          <p>This is code for login to System Ecommerce account !</p>
          <p style='border: 1px solid #e7e2e2;font-size: 40px;font-weight: bolder; border-radius: 10px;padding: 15px;width: 160px'>
            ${authCode}
          </p>
          <p>See you there,<br> Your friends at Ecommerce<br></p>
        </div>
      `;
    await this.sendMail(user.email as string, 'System Ecommerce send auth code for login', this.renderHtmlMailServices(baseMail, 'Verify Your ChatApp PassWord'));
    return;
  }

  async sendOverLoadSystem(memory: number, numberConectDb: number): Promise<void> {
    const baseMail = `
        <div style='overflow-wrap: break-word; background-color:#ffffff; line-height: 140%; padding: 30px;'>
          <h1>Hi Admin</h1>
          <p>System hass connected: ${numberConectDb} || Memory overload : ${memory} MB</p>
        </div>
      `;
    await this.sendMail('duyanh4788@gmail.com', 'Notifycation overload server', this.renderHtmlMailServices(baseMail, 'System overload!!!'));
    return;
  }

  private renderHtmlMailServices(teamplate: any, status: string) {
    const baseTeamplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name='Verify Your Ecommerce Account ' content='width=device-width, initial-scale=1'>
          <style>
            div {
              margin: 0 auto;
              min-width: 320px;
              max-width: 500px;
            }
            body {
              background-color: #F7F7F7;
              font-size: 14px;
              font-family: "Open Sans", Helvetica, sans-serif;
            }
            h1 {
              font-size: 22px;
            }
            p, span {
              font-size: 14px;
            }
            a {
              color: #46a4ca;
            }
          </style>
        </head>
        <body>
            <div style='Margin: 0 auto;min-width: 320px;max-width: 500px;'>
            <div style='background-color:#56ab2f; color: white; text-align: center; padding:10px 0;'>
                <p style='line-height: 140%; text-align: center;font-size: 20px;font-weight: bolder'>${status}</p>
            </div>
            ${teamplate}
            <div style='background-color:#56ab2f; color: white; text-align: center; padding:10px 0;'>
                <p style='line-height: 140%; text-align: center;font-size: 20px;font-weight: bolder'>Ecommerce</p>
            </div>
            </div>
        </body>
      </html>
    `;
    return baseTeamplate;
  }

  private async sendMail(toEmail: string, subject: string, htmlContent: string) {
    if (isDevelopment) return;
    await this.nodemailerTransport.sendMail({
      from: 'System Ecommerce Notification <duyanh4788@gmail.com>',
      to: toEmail,
      subject: subject,
      html: htmlContent
    });
  }
}

export const nodeMailerServices = new NodeMailerServices();

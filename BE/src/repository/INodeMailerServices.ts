import { UserAttributes } from '../interface/UserInterface';

export interface INodeMailerServices {
  sendWelcomeUserNotification(user: UserAttributes, authCode: string): Promise<void>;

  sendAuthCodeResetPassWord(user: UserAttributes, authCode: string): Promise<void>;

  sendOverLoadSystem(memory: number, numberConectDb: number): Promise<void>;
}

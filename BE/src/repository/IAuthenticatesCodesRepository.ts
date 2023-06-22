import { Transaction } from 'sequelize';
import { AuthenticatesCodesInterface } from '../interface/AuthenticatesCodesInterface';

export interface IAuthenticatesCodesRepository {
  findByUserId(userId: string): Promise<AuthenticatesCodesInterface>;

  findByAuthCode(authCode: string): Promise<AuthenticatesCodesInterface>;

  createAuthCode(userId: string, authCode: string, transactionDb?: Transaction): Promise<AuthenticatesCodesInterface>;

  deleteAuthCodeByUserId(userId: string, transactionDb: Transaction): Promise<void>;
}

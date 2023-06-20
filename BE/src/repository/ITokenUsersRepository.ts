import { Transaction } from 'sequelize';
import { TokenUserInterface } from '../interface/TokenUserInterface';

export interface ITokenUsersRepository {
  createTokenUsers(userId: string, publicKey: string, privateKey: string): Promise<TokenUserInterface>;

  findByUserId(userId: string): Promise<TokenUserInterface>;

  deleteTokenUserByUserId(userId: string): Promise<void>;
}

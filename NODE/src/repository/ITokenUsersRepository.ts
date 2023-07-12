import { Transaction } from 'sequelize';
import { TokenUserInterface } from '../interface/TokenUserInterface';

export interface ITokenUsersRepository {
  createTokenUsers(payload: TokenUserInterface): Promise<TokenUserInterface>;

  findByUserId(userId: string): Promise<TokenUserInterface>;

  deleteTokenUserByUserId(userId: string): Promise<void>;

  updateResfAndTokenUserByUserId(tokenUserId: string, refreshToKen: string, token: string): Promise<void>;

  updateTokenUserById(tokenUserId: string, tokenOld: string, tokenNew: string): Promise<void>;
}

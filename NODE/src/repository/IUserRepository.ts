import { Transaction } from 'sequelize';
import { UserAttributes, UserRole } from '../interface/UserInterface';

export interface IUserRepository {
  findAllLists(): Promise<UserAttributes[]>;

  findById(userId: string): Promise<UserAttributes>;

  findByEmail(email: string): Promise<UserAttributes>;

  updatePasswordByUserId(userId: string, newPassWord: string, email: string, transactionDb: Transaction): Promise<void>;

  createUser(fullName: string, email: string, password: string, phone: string, roleId: UserRole, transactionDb?: Transaction): Promise<UserAttributes>;

  updateProfile(reqBody: UserAttributes, userId: string): Promise<void>;
}

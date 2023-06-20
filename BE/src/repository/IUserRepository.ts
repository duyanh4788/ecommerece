import { Transaction } from 'sequelize';
import { UserAttributes, UserRole } from '../interface/UserInterface';

export interface IUserRepository {
  findAllLists(): Promise<UserAttributes[]>;

  findById(userId: string): Promise<UserAttributes>;

  findByEmail(email: string): Promise<UserAttributes>;

  createUser(fullName: string, email: string, password: string, phone: number, roleId: UserRole, transactionDb?: Transaction): Promise<UserAttributes>;
}

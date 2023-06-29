import { Transaction } from 'sequelize';
import { UsersResourcesInterface } from '../interface/UsersResourcesInterface';

export interface IUsersResourcesRepository {
  findByUserId(userId: string): Promise<UsersResourcesInterface>;

  findById(id: string): Promise<UsersResourcesInterface>;

  create(reqBody: UsersResourcesInterface, transactionDb?: Transaction): Promise<UsersResourcesInterface>;

  decretIncre(userId: string, value: any, type: string, num: number, transactionDb?: Transaction): Promise<void>;
}
